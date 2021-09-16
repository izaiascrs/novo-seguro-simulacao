import axios from 'axios';


const url ='https://novoseguros-api.herokuapp.com/api/v2/cotacao/calcular';

export const calculateInsurance = async (data) => axios.post(url, data); 