This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## My website
The goal of this project was to learn how to use Next.js, Tailwind CSS and get refreshed with HTML and Javascript/Typescript. 

## Raspberry Pi 5
The app is being hosted on my pi (8gb), hosting the application files and serving content, and to make the app accessible from the internet securely and reliably, a Cloudflare Tunnel is used (free service). All you need is to own a domain name (in my case titouanguerin.com).
A Cloudflare Tunnel securely exposes the Raspberry Pi’s local server to the internet without needing to open ports on the router.
It acts as a reverse proxy, creating a secure, encrypted connection between the Cloudflare network and the Raspberry Pi.
This setup enhances security by hiding the Raspberry Pi’s actual IP address and protects against direct attacks.
The tunnel encrypts traffic and minimizes exposure of the Raspberry Pi to potential threats.
This means I do not have to deal with complex router configurations or static IPs.
Also, using the Raspberry Pi for hosting is energy-efficient and economical, plus I get to play around with a new toy so that's always fun.
