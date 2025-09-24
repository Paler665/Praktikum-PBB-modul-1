// src/models/medicationModel.js
import { supabase } from "../config/supabaseClient.js";

export const MedicationModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("medications")
      .select("id, sku, name, description, price, quantity, category_id, supplier_id");
    if (error) throw error;
    return data;
  },

  // ⬇⬇ Tambahan: pencarian + pagination + total count
  async searchWithPagination({ name, page = 1, limit = 10 }) {
    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.max(parseInt(limit, 10) || 10, 1);
    const from = (p - 1) * l;
    const to = from + l - 1;

    let query = supabase
      .from("medications")
      .select(
        "id, sku, name, description, price, quantity, category_id, supplier_id",
        { count: "exact" } // minta total count
      );

    if (name && String(name).trim() !== "") {
      // ilike = case-insensitive contains
      query = query.ilike("name", `%${name}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;

    const total = count ?? 0;
    const totalPages = Math.max(Math.ceil(total / l), 1);

    return {
      items: data || [],
      page: p,
      limit: l,
      total,
      totalPages,
    };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("medications")
      .select(`
        id, sku, name, description, price, quantity,
        categories ( id, name ),
        suppliers ( id, name, email, phone )
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase.from("medications").insert([payload]).select();
    if (error) throw error;
    return data[0];
  },

  async update(id, payload) {
    const { data, error } = await supabase.from("medications").update(payload).eq("id", id).select();
    if (error) throw error;
    return data[0];
  },

  async remove(id) {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },
};
