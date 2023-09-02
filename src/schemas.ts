import * as z from "zod";

// Events Schema

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  date: z.string(),
  price: z.number(),
  image: z.string(),
  location: z.string(),
});

export const EventsSchema = z.array(EventSchema);

export const EventDetailSchema = EventSchema.extend({
  description: z.string(),
  speakers: z.array(z.string()),
  capacity: z.number(),
  availableSpots: z.number(),
});

export const UserEventsSchema = z.array(EventSchema);

// Authentication Schema

export const AuthResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const SignUpInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

// General Schema

export const IdSchema = z.string();
