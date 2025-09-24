// src/controllers/medicationController.js
import { MedicationModel } from "../models/medicationModel.js";

export const MedicationController = {
  // ⬇⬇ Update: GET /api/medications?name=...&page=...&limit=...
  async getAll(req, res) {
    try {
      const { name, page, limit } = req.query;
      const result = await MedicationModel.searchWithPagination({ name, page, limit });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const med = await MedicationModel.getById(req.params.id);
      res.json(med);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { price, quantity } = req.body;

      // ⬇⬇ Validasi harga & stok
      if (price != null && Number(price) < 0) {
        return res.status(400).json({ error: "price tidak boleh kurang dari 0" });
      }
      if (quantity != null && Number(quantity) < 0) {
        return res.status(400).json({ error: "quantity tidak boleh kurang dari 0" });
      }

      const med = await MedicationModel.create(req.body);
      res.status(201).json(med);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { price, quantity } = req.body;

      // ⬇⬇ Validasi harga & stok
      if (price != null && Number(price) < 0) {
        return res.status(400).json({ error: "price tidak boleh kurang dari 0" });
      }
      if (quantity != null && Number(quantity) < 0) {
        return res.status(400).json({ error: "quantity tidak boleh kurang dari 0" });
      }

      const med = await MedicationModel.update(req.params.id, req.body);
      res.json(med);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await MedicationModel.remove(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
