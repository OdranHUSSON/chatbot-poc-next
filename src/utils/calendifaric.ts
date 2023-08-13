import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_CALENDARIFIC_API_KEY,

export const addEventToCalendar = async (event: any) => {
  try {
    const response = await axios.post('https://api.calendarific.com/v2/events', {
      ...event,
      api_key: API_KEY,
    });

    return response.data;
  } catch (error) {
    console.error('Error adding event to Calendarific:', error);
    throw error;
  }
};
