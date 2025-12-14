
import { RegistrationData } from "../types";

// Usar caminho relativo para que funcione tanto no localhost quanto no domínio do Render
const API_URL = '/api/register';

export const registerNinja = async (data: RegistrationData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao cadastrar');
    }

    return result;
  } catch (error) {
    console.error("Erro na API:", error);
    // Em produção, se falhar, provavelmente é erro de rede ou banco.
    // Manteremos o throw para o App.tsx tratar.
    throw error;
  }
};
