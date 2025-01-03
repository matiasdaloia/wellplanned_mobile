import type { Provider } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import { supabase } from "../supabase";

import {
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import {
  CryptoDigestAlgorithm,
  digestStringAsync,
  randomUUID,
} from "expo-crypto";

/**
 * Initiates the auth flow for the native Apple Sign In.
 * Returns the token and nonce that will later be passed
 * to Supabase to complete the sign in.
 */
export async function initiateAppleSignIn() {
  const rawNonce = randomUUID();
  const hashedNonce = await digestStringAsync(
    CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  const credential = await signInAsync({
    requestedScopes: [
      AppleAuthenticationScope.FULL_NAME,
      AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  const token = credential.identityToken;
  if (!token) throw new Error("No id token");

  return { token, nonce: rawNonce };
}

export const redirectTo = makeRedirectUri();

export const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

export const signInWithApple = async () => {
  try {
    const { token, nonce } = await initiateAppleSignIn();
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token,
      nonce,
    });
    if (error) return Alert.alert("Error", error.message);
  } catch (e) {
    if (typeof e === "object" && !!e && "code" in e) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    } else {
      console.error("Unexpected error from Apple SignIn: ", e);
    }
  }
};

export const performOAuth = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    Alert.alert("Error", error.message);
  }

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};
