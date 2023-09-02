import axios from "axios";
import {
  EventsSchema,
  EventDetailSchema,
  UserEventsSchema,
  AuthResponseSchema,
  LoginInputSchema,
  SignUpInputSchema,
  IdSchema,
} from "../schemas";
import z from "zod";

const api = axios.create({
  baseURL: "http://localhost:3001/",
});

// Simulating a very slow network
api.interceptors.request.use(
  async (config) => {
    // Delay for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication

export const signUp = async (data: z.infer<typeof SignUpInputSchema>) => {
  const response = await api.post("/signup", data);
  return AuthResponseSchema.parse(response.data);
};

export const login = async (data: z.infer<typeof LoginInputSchema>) => {
  const response = await api.post("/login", data);
  return AuthResponseSchema.parse(response.data);
};

// Events

export const fetchEvents = async () => {
  const response = await api.get("/events");
  return EventsSchema.parse(response.data);
};

export const fetchEvent = async (id: string) => {
  const response = await api.get(`/events/${id}`);
  return EventDetailSchema.parse(response.data);
};

export const fetchUserEvents = async (userId: string) => {
  const response = await api.get(`/user/${userId}/events`);
  return UserEventsSchema.parse(response.data);
};

// Registration for an event

export const register = async (userId: string, eventId: string) => {
  const response = await api.post("/register", { userId, eventId });
  return IdSchema.parse(response.data.id);
};
