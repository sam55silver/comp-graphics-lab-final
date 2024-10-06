# Use nginx as the base image
FROM nginx:latest

# Set the working directory to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copy contents of rootdir to the NGINX web root directory
COPY . .

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]

