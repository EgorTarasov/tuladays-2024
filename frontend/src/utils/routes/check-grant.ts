import { AuthService } from "@/stores/auth.service";
import { redirect } from "@tanstack/react-router";

export const checkAuth = (v: { location: { href: string } }) => {
  if (AuthService.auth.state === "authenticated") {
    return;
  }

  throw redirect({
    to: "/login",
    search: {
      redirect: v.location.href,
    },
  });
};

export const checkDoctor = (v: { location: { href: string } }) => {
  if (AuthService.auth.state !== "authenticated") {
    throw redirect({
      to: "/login",
      search: {
        redirect: v.location.href,
      },
    });
  }

  if (AuthService.auth.user.role !== "doctor") {
    throw redirect({
      to: "/",
    });
  }
};

export const checkPatient = (v: { location: { href: string } }) => {
  if (AuthService.auth.state !== "authenticated") {
    throw redirect({
      to: "/login",
      search: {
        redirect: v.location.href,
      },
    });
  }

  if (AuthService.auth.user.role !== "patient") {
    throw redirect({
      to: "/",
    });
  }
};
