import React, { useEffect, useRef, useState } from "react";
import { Primary, Secondery70 } from "../utils/CommonStyles";

export enum UpdateCardStatus {
  Correct,
  NotFilledIn,
  Wrong,
  Typing,
}

export interface UpdateResult {
  cardType: "mastercard" | "visa" | "jcb" | "amex" | "unionpay" | "unknown";
  canGetPrime: boolean;
  hasError: boolean;
  status: {
    number: UpdateCardStatus;
    expiry: UpdateCardStatus;
    ccv: UpdateCardStatus;
  };
}

export type UpdateCallback = (result: UpdateResult) => void;

export interface TapPayDirect {
  setupSDK: Function;
  card: {
    setup: Function;
    onUpdate: (callback: UpdateCallback) => void;
    getPrime: (
      callback: (result: { status: number; card: { prime: string } }) => void
    ) => void;
    getTappayFieldsStatus: () => { canGetPrime: boolean };
  };
}

declare global {
  interface Window {
    TPDirect: TapPayDirect;
  }
}

let hasInit = false;

const useTPDirect = () => {
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [cardNumberValid, setCardNumberValid] = useState(false);
  const [cardExpirationValid, setCardExpirationValid] = useState(false);
  const [cardVerificationCodeValid, setCardVerificationCodeValid] =
    useState(false);
  const getPrime = () => {
    return new Promise<string | null>((resolve, reject) => {
      window.TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
          resolve(null);
        }
        resolve(result.card.prime);
      });
    });
  };

  const setup = (
    cardNumberId: string,
    expirationDateId: string,
    ccvId: string
  ) => {
    const cardNumberElement = document.getElementById(cardNumberId);
    const expirationDateElement = document.getElementById(expirationDateId);
    const ccvElement = document.getElementById(ccvId);

    window.TPDirect.setupSDK(
      11327,
      "app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC",
      "sandbox"
    );

    window.TPDirect.card.setup({
      fields: {
        number: { element: cardNumberElement },
        expirationDate: { element: expirationDateElement },
        ccv: { element: ccvElement },
      },
      styles: {
        input: {
          color: `${Secondery70}`,
          "font-size": "16px",
        },
      },
    });

    window.TPDirect.card.onUpdate((update) => {
      if (update.status.number === UpdateCardStatus.Correct) {
        setCardNumberValid(true);
        cardNumberElement?.classList.remove("has-danger");
      } else {
        setCardNumberValid(false);
        cardNumberElement?.classList.add("has-danger");
      }
      if (update.status.expiry === UpdateCardStatus.Correct) {
        setCardExpirationValid(true);
        expirationDateElement?.classList.remove("has-danger");
      } else {
        setCardExpirationValid(false);
        expirationDateElement?.classList.add("has-danger");
      }
      if (update.status.ccv === UpdateCardStatus.Correct) {
        setCardVerificationCodeValid(true);
        ccvElement?.classList.remove("has-danger");
      } else {
        setCardVerificationCodeValid(false);
        ccvElement?.classList.add("has-danger");
      }
    });
  };

  useEffect(() => {
    if (!hasInit) {
      const script = document.createElement("script");
      script.onload = () => {
        setLoadingSuccess(true);
        hasInit = true;
      };
      script.src = "https://js.tappaysdk.com/sdk/tpdirect/v5.14.0";
      document.body.appendChild(script);
      document.body.removeChild(script);
      const style = document.createElement("style");
      style.innerHTML = `
        .tappay-field-focus {
          outline: none;
          border: 1px solid ${Primary};
          box-shadow: 0 0 4px ${Primary};
        }
        .has-danger.tappay-field-focus {
          outline: none;
          border: 1px solid red;
          box-shadow: 0 0 4px red;
        }
      `;
      document.body.appendChild(style);
    }
  }, []);

  return {
    loadingSuccess: loadingSuccess || hasInit,
    cardIsValid:
      cardNumberValid && cardExpirationValid && cardVerificationCodeValid,
    setup,
    getPrime,
  };
};

export default useTPDirect;
