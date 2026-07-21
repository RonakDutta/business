import { api, toBody } from "./client.js";

/* TEAM (organisers). Public list; admin create/update/delete. Pass an `image`
   File on create/update to upload a portrait. */

export async function list() {
  const { team } = await api.get("/team");
  return team;
}

export async function create(payload) {
  const { member } = await api.post("/team", toBody(payload));
  return member;
}

export async function update(id, payload) {
  const { member } = await api.patch(`/team/${id}`, toBody(payload));
  return member;
}

export function remove(id) {
  return api.delete(`/team/${id}`);
}
