import socket
import threading

# Define the target host and port
# for mosquitto and minikube
TARGET_HOST = '192.168.49.2'
TARGET_PORT = 31711

# Define the local listening port
LOCAL_PORT = 8082

def handle_client(client_socket):
    while True:
        # Receive data from the client
        data = client_socket.recv(4096)
        if not data:
            break
        
        # Create a new socket to communicate with the target
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as target_socket:
            try:
                # Connect to the target
                target_socket.connect((TARGET_HOST, TARGET_PORT))
                # Forward received data to the target
                target_socket.sendall(data)
                # Receive response from the target
                response = target_socket.recv(4096)
                # Forward response to the client
                client_socket.sendall(response)
            except Exception as e:
                print("Error:", e)
                break

    # Close the connection with the client
    client_socket.close()

def main():
    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Bind the socket to the local address and port
    server_socket.bind(('0.0.0.0', LOCAL_PORT))

    # Start listening for incoming connections
    server_socket.listen(5)
    print(f"[*] Listening on 0.0.0.0:{LOCAL_PORT}")

    try:
        while True:
            # Accept incoming connection
            client_socket, client_address = server_socket.accept()
            print(f"[*] Accepted connection from {client_address[0]}:{client_address[1]}")
            
            # Handle client in a separate thread
            client_handler = threading.Thread(target=handle_client, args=(client_socket,))
            client_handler.start()

    except KeyboardInterrupt:
        print("\n[*] Exiting...")
        server_socket.close()

if __name__ == "__main__":
    main()
