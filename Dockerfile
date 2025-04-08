FROM --platform=linux/x86_64 node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build your Next.js project (if not already built)
RUN npm run build

# Expose port 3000 to be accessible from the outside
EXPOSE 3000

# Run the development server
CMD ["npm", "start"]