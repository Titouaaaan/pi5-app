# Personal Portfolio Website

Welcome to my personal portfolio website! This site showcases my projects, education, and work experience, providing a comprehensive overview of my journey in computer science and software development. I created this website as a fun side project to experiment with modern web technologies and to have a personal space to share my work and achievements.

Check it out here: pi.titouanguerin.com

## Table of Contents

- [Frontend Technology](#frontend-technology)
- [Backend Technology](#backend-technology)
- [Hosting](#hosting)
- [Additional Notes](#additional-notes)

## Frontend Technology

The frontend of this website is built using:

- **Next.js**: A powerful React framework that enables server-side rendering and static site generation.
- **TypeScript**: Adds static typing to JavaScript, enhancing code quality and maintainability.
- **CSS**: Used for styling the website, ensuring a clean and responsive design.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Backend Technology

The backend is powered by:

- **Python**: Very based.
- **FastAPI**: A modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Hosting

The app is being hosted on my **Raspberry Pi 5** (8gb), hosting the application files and serving content, and to make the app accessible from the internet securely and reliably, a **Cloudflare tunnel** is used (free service). All you need is to own a domain name (in my case titouanguerin.com).
A Cloudflare Tunnel securely exposes the Raspberry Pi’s local server to the internet without needing to open ports on the router.
It acts as a reverse proxy, creating a secure, encrypted connection between the Cloudflare network and the Raspberry Pi.
This setup enhances security by hiding the Raspberry Pi’s actual IP address and protects against direct attacks.
The tunnel encrypts traffic and minimizes exposure of the Raspberry Pi to potential threats.
This means I do not have to deal with complex router configurations or static IPs.
Also, using the Raspberry Pi for hosting is energy-efficient and economical, plus I get to play around with a new toy so that's always fun.

## Additional Notes

- **Responsive Design**: The website is designed to be responsive, providing an optimal viewing experience across various devices and screen sizes (still a bit broken on mobile but we'll fix that).
- **Future Enhancements**: I plan to continue enhancing this website with new features and improvements, such as integrating AI functionalities (with the pi AI toolkit).
- **Open Source**: Also very based.

Feel free to explore the codebase, and don't hesitate to reach out if you see any issues <3

---
