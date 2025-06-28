import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import drimage from './drimage.jpeg'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'
import header from './header.jpeg'
import banner from './banner.jpeg'
import grp from './grp.jpg'
import about from './doc_about.jpg'
import contact from './contact_img.jpg'
export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    header,
    banner,
    grp,
    about,
    contact
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Usman Farooq',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Usman specializes in general medicine, providing preventive care and expert treatment.',
        fees: 50,
        address: {
            line1: 'Main Bazaar',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Sana Ali',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Sana is dedicated to women’s health, offering compassionate gynecological care.',
        fees: 60,
        address: {
            line1: 'Ravi Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Azhar Naeem',
        image: drimage,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Azhar Naeem provides expert skincare and treatments for various dermatological conditions.',
        fees: 40,
        address: {
            line1: 'College Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Hamza Malik',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Hamza specializes in child healthcare and development, providing excellent pediatric services.',
        fees: 50,
        address: {
            line1: 'Hospital Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Ayesha Siddiqui',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Dr. Ayesha is an expert in neurological disorders and dedicated to improving brain health.',
        fees: 70,
        address: {
            line1: 'Railway Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Sameer Ahmed',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Sameer is experienced in treating neurological disorders with advanced care techniques.',
        fees: 65,
        address: {
            line1: 'Nanak Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Shahid Ali',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Shahid Ali focuses on preventive medicine and patient wellness through expert diagnostics.',
        fees: 50,
        address: {
            line1: 'Market Street',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Amjad Rana',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Amjad Rana offers comprehensive care for women, specializing in maternal health.',
        fees: 70,
        address: {
            line1: 'Lahore Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Hassan Raza',
        image: doc8,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Hassan provides treatment for a variety of skin conditions using modern techniques.',
        fees: 50,
        address: {
            line1: 'Mall Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Arfa Shah',
        image: doc11,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Arfa is skilled in managing child health issues and ensuring their holistic development.',
        fees: 45,
        address: {
            line1: 'Station Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Taimoor Khan',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Dr. Taimoor specializes in managing neurological conditions with personalized care.',
        fees: 80,
        address: {
            line1: 'Shrine Area',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Yasmin Tariq',
        image: doc15,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Yasmin offers quality healthcare services, emphasizing preventive and diagnostic care.',
        fees: 55,
        address: {
            line1: 'Sadar Bazar',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Saad Abbasi',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Saad provides exceptional gynecological and obstetric care to women.',
        fees: 65,
        address: {
            line1: 'Circular Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Mahnoor Iqbal',
        image: doc13,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Mahnoor specializes in treating skin conditions with the latest techniques.',
        fees: 35,
        address: {
            line1: 'Housing Colony',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Kamran Yousaf',
        image: doc1,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Dr. Kamran is an expert in pediatric care and child development, ensuring well-being.',
        fees: 60,
        address: {
            line1: 'Jinnah Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc16',
        name: 'Dr. Mehwish Iqbal',
        image: doc11,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Mehwish specializes in treating skin conditions with the latest techniques.',
        fees: 35,
        address: {
            line1: 'Housing Colony',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc17',
        name: 'Dr. Ahsan Khan',
        image: doc14,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Dr. Ahsan specializes in managing neurological conditions with personalized care.',
        fees: 80,
        address: {
            line1: 'Shrine Area',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Khalid Rana',
        image: doc8,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Khalid Rana offers comprehensive care for women, specializing in maternal health.',
        fees: 70,
        address: {
            line1: 'Lahore Road',
            line2: 'Nankana Sahib, Pakistan'
        }
    },
];

