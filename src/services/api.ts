export interface ExchangeRate {
  bid: string;
  name: string;
}

export const getDollarRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    if (!response.ok) throw new Error('Falha na requisição');
    
    const data = await response.json();
    // Retorna o valor de compra (bid) convertido para número
    return parseFloat(data.USDBRL.bid);
  } catch (error) {
    console.error("Erro ao buscar API:", error);
    throw error;
  }
};