osascript -e 'display notification "Docker image is building..." with title "Build started..."'
docker build -t clogii-mobile-server --rm .
osascript -e 'display notification "Docker image is built" with title "Complete"'
