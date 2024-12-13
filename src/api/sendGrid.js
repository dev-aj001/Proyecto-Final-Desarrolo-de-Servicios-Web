require('dotenv').config();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendEmail = async (email, name, type = 'register') => {
    const msg = {

        from: {
            email: 'arjaibanezpa@ittepic.edu.mx',
        },
        personalizations: [
            {
                to: [
                    {
                        email: email,
                        name: name
                    }
                ],
                dynamic_template_data: {
                    name: name
                }
            }
        ],
        template_id: type==='register' ? 'd-f6cc752d0e3b44faa42200aa5247ba54' : 'd-6c9b4a8b7b9f4a9f8c9b7b9f4a9f8c9b',
     }

    sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = sendEmail;