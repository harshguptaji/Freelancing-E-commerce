import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async(mobile,msg) => {
    try {
        await client.messages.create({
            body: msg,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobile
        });
    } catch (error) {
        console.log(`Error - ${error}`);
    }
};