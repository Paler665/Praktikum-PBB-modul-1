// src/controllers/reportController.js
import { supabase } from "../config/supabaseClient.js";

export const ReportController = {
  // GET /api/reports/total
  async totalMedications(req, res) {
    try {
      const { count, error } = await supabase
        .from("medications")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      res.json({ total: count ?? 0 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
