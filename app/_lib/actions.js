"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("Your must be loggen in");
  console.log(session);
  const national_Id_num = formData.get("national_Id_num");
  const [nationality, country_flag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(national_Id_num))
    throw new Error("Please provide a valid national Id");

  const updateData = { nationality, country_flag, national_Id_num };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) {
    throw new Error("Guest could not be updated" + error.message);
  }

  revalidatePath("/account/profile ");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) {
    throw new Error("Bookings could not be deleted");
  }

  revalidatePath("/account/reservations ");
}

export async function updateReservation(formData) {
  const bookingId = Number(formData.get("bookingId"));
  //Authentication
  const session = await auth();
  if (!session) throw new Error("Booking could not be loaded");

  //Authorization
  const guestBooking = await getBookings(session.user.guestId);
  const guestBookingIds = guestBooking.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  //Updating of data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  //Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  //Error handling
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  //Revalidating
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");
  //Redirecting
  redirect("/account/reservations");
}

export async function createReservation(bookingData, formData) {
  console.log(formData);
  const session = await auth();
  if (!session) throw new Error("You need to be looged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Bookings could not be created " + error.message);

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}
export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
