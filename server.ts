
import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Paystack Verification Endpoint
  app.post("/api/verify-payment", async (req, res) => {
    const { reference } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_bbacb3d35f94423b5bd8a6a96b2fb74f360765c8";

    try {
      console.log(`Verifying Paystack reference: ${reference}`);
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const data = response.data;
      console.log(`Paystack response for ${reference}:`, data.status);

      if (data.status && data.data.status === "success") {
        // In a real app, you'd update the database here using firebase-admin
        // For this demo, we'll return success and let the client handle the UI update
        // (Security note: Always perform balance updates server-side in production)
        res.json({ 
          success: true, 
          amount: data.data.amount, // amount in kobo
          customer: data.data.customer 
        });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    } catch (error: any) {
      console.error("Paystack Verification Error:", error.response?.data || error.message);
      res.status(500).json({ success: false, message: "Internal server error during verification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
