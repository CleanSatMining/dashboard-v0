import { NextApiRequest, NextApiResponse } from 'next';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from 'src/database/firebase';
import { SiteID } from 'src/constants/csm';
import { UserData, AnonymeUserData } from 'src/types/payments';

/* eslint-disable */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  /* eslint-enable */
  const { id, address } = req.query;

  if (!id && !address) {
    return res
      .status(400)
      .json({ error: "L'id du site et l'adresse utilisateur sont requis." });
  }

  if (id === SiteID.alpha) {
    try {
      // Charge les données depuis le fichier
      const data: UserData[] = (await downloadFile()).filter(
        (user) =>
          user.ethAddress.toLowerCase() ===
          (address ?? '').toString().toLowerCase(),
      );

      const anonymeData: AnonymeUserData[] = data.map((user) => ({
        usdcSend: user.usdcSend,
        usdcReceived: user.usdcReceived,
        tokenAmount: user.tokenAmount,
        ethAddress: user.ethAddress,
      }));

      console.log('data', data, anonymeData);
      return res.status(200).json({ success: true, data: anonymeData });
    } catch (error) {
      console.error('Erreur lors de la lecture des données :', error);
      return res
        .status(500)
        .json({ success: false, error: 'Erreur serveur interne.' });
    }
  } else {
    return res.status(404).json({ error: "L'id du site n'est pas trouvé." });
  }
}

export async function downloadFile(): Promise<UserData[]> {
  const storage = getStorage(app);
  // Create a storage reference from our storage service
  const storageRef = ref(storage, 'users/savedData.json');

  // Get the download URL
  try {
    const url = await getDownloadURL(storageRef);

    // Fetch the JSON data at the URL
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
}
