import {useNavigate} from 'react-router-dom';

export default {
    krDateTime : (date) => {
        return new Date(new Date(date) - new Date().getTimezoneOffset() * 60000).toISOString().split('.')[0].replace('T', ' ')
    },
    IsJsonString : (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    goBack : () => {
        useNavigate(-1);
    },
    goForward : () => {
        useNavigate(1);
    }
    
}
