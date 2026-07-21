/* ===========================================================================
   API surface — one import for the whole backend.

       import { events, auth } from "../api";
       const list = await events.list("upcoming");
       const user = await auth.login({ email, password });

   Nothing consumes this yet: the app still runs on its localStorage stubs
   (AuthContext, EventsContext, RsvpContext, SavedEventsContext). Wiring a
   context over to these calls is the next step, one context at a time.
   =========================================================================== */

import * as auth from "./auth.js";
import * as events from "./events.js";
import * as rsvps from "./rsvps.js";
import * as saved from "./saved.js";
import * as team from "./team.js";
import * as payments from "./payments.js";
import * as subscribers from "./subscribers.js";
import * as contact from "./contact.js";
import * as venue from "./venue.js";

export { auth, events, rsvps, saved, team, payments, subscribers, contact, venue };

// Low-level escape hatches, if a caller needs the raw client or token store.
export { api, getToken, setToken, clearToken } from "./client.js";
