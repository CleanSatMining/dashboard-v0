export type UserData = {
    email: string;
    usdcSend: number;
    usdcReceived: number;
    firstName: string;
    lastName: string;
    ethAddress: string;
    btcAddress: string;
    tokenAmount: number;
  };

export type AnonymeUserData = {
    usdcSend: number;
    usdcReceived: number;
    tokenAmount: number;
    ethAddress: string;
}