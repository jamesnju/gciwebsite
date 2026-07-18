'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get current date and time
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });

      // Get keys from environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      // Send email using EmailJS
      const result = await emailjs.send(
        serviceId!,
        templateId!,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          time: formattedTime, // Add the formatted time
        },
        publicKey!
      );
      
      console.log('Email sent successfully:', result.text);
      setSubmitted(true);
      
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 5000); // Show success message for 5 seconds
      
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section
        className="py-16 px-4 text-center animate-fade-in-down"
        style={{ backgroundColor: '#9ec8ea' }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#845c33' }}
        >
          Get in Touch
        </h1>
        <p className="text-lg" style={{ color: '#845c33' }}>
          We would love to hear from you. Reach out to us with any questions.
        </p>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="animate-fade-in-left">
              <h2
                className="text-2xl font-bold mb-8"
                style={{ color: '#845c33' }}
              >
                Contact Information
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: <Phone className="w-6 h-6" />,
                    title: 'Phone',
                    content: '(+254) 722 707-193',
                  },
                  {
                    icon: <Mail className="w-6 h-6" />,
                    title: 'Email',
                    content: 'utawala@gospelcentresinternational.org',
                  },
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    title: 'Address',
                    content: 'Utawala, Nairobi Kenya',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-lg text-white"
                      style={{ backgroundColor: '#845c33' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: '#845c33' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: '#845c33' }}
                >
                  Service Hours
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Sunday:</strong> 9:00 AM - 12:30 PM
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Wednesday:</strong> 6:00 PM - 8:00 PM
                </p>
                <p className="text-gray-700">
                  <strong>Saturday:</strong> By appointment
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-right">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#845c33]"
                    style={{
                      borderColor: '#9ec8ea',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#9ec8ea' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#9ec8ea' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#845c33' }}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>

                {submitted && (
                  <div
                    className="p-4 rounded-lg text-center font-semibold animate-fade-in-up"
                    style={{ backgroundColor: '#9ec8ea', color: '#845c33' }}
                  >
                    ✅ Thank you! We will be in touch soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


// 'use client';

// import { Mail, Phone, MapPin } from 'lucide-react';
// import { useState } from 'react';

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);
//     setTimeout(() => {
//       setFormData({ name: '', email: '', message: '' });
//       setSubmitted(false);
//     }, 3000);
//   };

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <section
//         className="py-16 px-4 text-center animate-fade-in-down"
//         style={{ backgroundColor: '#9ec8ea' }}
//       >
//         <h1
//           className="text-4xl md:text-5xl font-bold mb-4"
//           style={{ color: '#845c33' }}
//         >
//           Get in Touch
//         </h1>
//         <p className="text-lg" style={{ color: '#845c33' }}>
//           We would love to hear from you. Reach out to us with any questions.
//         </p>
//       </section>

//       {/* Content */}
//       <section className="py-16 md:py-24 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-12">
//             {/* Contact Info */}
//             <div className="animate-fade-in-left">
//               <h2
//                 className="text-2xl font-bold mb-8"
//                 style={{ color: '#845c33' }}
//               >
//                 Contact Information
//               </h2>

//               <div className="space-y-6">
//                 {[
//                   {
//                     icon: <Phone className="w-6 h-6" />,
//                     title: 'Phone',
//                     content: '(+254) 722 707-193',
//                   },
//                   {
//                     icon: <Mail className="w-6 h-6" />,
//                     title: 'Email',
//                     content: 'utawala@gospelcentresinternational.org',
//                   },
//                   {
//                     icon: <MapPin className="w-6 h-6" />,
//                     title: 'Address',
//                     content: 'Utawala, Nairobi Kenya',
//                   },
//                 ].map((item, index) => (
//                   <div key={index} className="flex items-start gap-4">
//                     <div
//                       className="p-3 rounded-lg text-white"
//                       style={{ backgroundColor: '#845c33' }}
//                     >
//                       {item.icon}
//                     </div>
//                     <div>
//                       <h3
//                         className="font-semibold mb-1"
//                         style={{ color: '#845c33' }}
//                       >
//                         {item.title}
//                       </h3>
//                       <p className="text-gray-700">{item.content}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8">
//                 <h3
//                   className="text-xl font-bold mb-4"
//                   style={{ color: '#845c33' }}
//                 >
//                   Service Hours
//                 </h3>
//                 <p className="text-gray-700 mb-2">
//                   <strong>Sunday:</strong> 9:00 AM - 12:30 PM
//                 </p>
//                 <p className="text-gray-700 mb-2">
//                   <strong>Wednesday:</strong> 6:00 PM - 8:00 PM
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>Saturday:</strong> By appointment
//                 </p>
//               </div>
//             </div>

//             {/* Contact Form */}
//             <div className="animate-fade-in-right">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block font-semibold mb-2"
//                     style={{ color: '#845c33' }}
//                   >
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#845c33]"
//                     style={{
//                       borderColor: '#9ec8ea',
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block font-semibold mb-2"
//                     style={{ color: '#845c33' }}
//                   >
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
//                     style={{ borderColor: '#9ec8ea' }}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="message"
//                     className="block font-semibold mb-2"
//                     style={{ color: '#845c33' }}
//                   >
//                     Message
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     rows={5}
//                     className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
//                     style={{ borderColor: '#9ec8ea' }}
//                   ></textarea>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
//                   style={{ backgroundColor: '#845c33' }}
//                 >
//                   Send Message
//                 </button>

//                 {submitted && (
//                   <div
//                     className="p-4 rounded-lg text-center font-semibold animate-fade-in-up"
//                     style={{ backgroundColor: '#9ec8ea', color: '#845c33' }}
//                   >
//                     Thank you! We will be in touch soon.
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
