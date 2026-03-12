import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Lead from "../models/Lead.js";

const router = express.Router();

const GRAPH_VERSION = "v19.0";

const normalizePhone = (phone) => String(phone || "").replace(/[^\d]/g, "");

const buildMessageForLead = (lead) => {
  const lang = lead.preferredLanguage || "english";

  switch (lang) {
    case "hindi":
      return (
        `नमस्ते ${lead.name},\n\n` +
        `${lead.propertyInterestedIn || "प्रॉपर्टी"} में आपकी रुचि के लिए धन्यवाद। ` +
        `मैं आपको और जानकारी और साइट विज़िट स्लॉट भेज सकता हूँ.\n\n` +
        `कृपया अपने सुविधाजनक दिन और समय के साथ रिप्लाई करें।`
      );
    case "marathi":
      return (
        `नमस्कार ${lead.name},\n\n` +
        `${lead.propertyInterestedIn || "प्रॉपर्टी"} मध्ये आपल्याला रस दाखवल्याबद्दल धन्यवाद. ` +
        `मी अधिक माहिती आणि साइट व्हिजिटचा वेळ शेअर करू शकतो.\n\n` +
        `कृपया आपला सोयीस्कर दिवस आणि वेळ कळवा.`
      );
    case "english_hindi":
      return (
        `Hi ${lead.name},\n\n` +
        `Thanks for your interest in ${lead.propertyInterestedIn || "the property"}. ` +
        `Main aapko aur details aur site visit slots share kar sakta hoon.\n\n` +
        `Please reply with a convenient day and time.`
      );
    case "english_marathi":
      return (
        `Hi ${lead.name},\n\n` +
        `${lead.propertyInterestedIn || "property"} बद्दल interest दाखवल्याबद्दल thanks. ` +
        `मी तुम्हाला अजून details आणि site visit time share करू शकतो.\n\n` +
        `तुमचा सोयीस्कर दिवस आणि वेळ कळवा.`
      );
    case "english":
    default:
      return (
        `Hi ${lead.name},\n\n` +
        `Thanks for your interest in ${
          lead.propertyInterestedIn || "the property"
        }. ` +
        `I can share more details and schedule a visit.\n\n` +
        `Reply with a preferred time and I’ll coordinate.\n\n` +
        `– Your Real Estate Agent`
      );
  }
};

router.post("/send", authMiddleware, async (req, res) => {
  try {
    let toPhone;
    let text;

    if (req.body.leadId) {
      const lead = await Lead.findOne({
        _id: req.body.leadId,
        userId: req.user._id,
      });

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      toPhone = normalizePhone(lead.phone);
      text = buildMessageForLead(lead);
    } else {
      // Backwards-compatible: direct phone + text
      toPhone = normalizePhone(req.body?.toPhone);
      text = String(req.body?.text || "").trim();
    }

    if (!toPhone || !text) {
      return res
        .status(400)
        .json({ message: "leadId or toPhone/text are required" });
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
      return res.status(500).json({
        message:
          "WhatsApp config missing. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in backend/.env",
      });
    }

    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: toPhone,
      type: "text",
      text: { body: text },
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return res.status(resp.status).json({
        message: "Failed to send WhatsApp message",
        details: data,
      });
    }

    res.json({ ok: true, response: data });
  } catch (err) {
    console.error("WhatsApp send error", err);
    res.status(500).json({ message: "Failed to send WhatsApp message" });
  }
});

export default router;


