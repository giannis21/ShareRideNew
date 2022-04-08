import axios from 'axios';
import { BASE_URL } from "../constants/Constants"
const instance = axios.create({
  baseURL: 'http://192.168.1.5:3000',
});


export default instance