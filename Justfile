service_name := "wishing-wells"
git_revision := `git rev-parse --short HEAD`
image_tag := git_revision
image_name := "docker-repository" / service_name

# run docker build
build:
    docker buildx build \
        --push \
        --pull \
        --label git-revision={{git_revision}} \
        -t {{image_name}} \
        -t {{image_name}}:{{ image_tag }} \
        .

# deploy the image
deploy space="dev" tag="latest":
    #!/bin/sh

    if [ "{{ tag }}" = "latest" ]; then
      docker pull {{ image_name }}:latest
      TAG=$(docker inspect --format '{{{{ index .Config.Labels "git-revision" }}' {{ image_name }}:latest)
    fi

    echo "execute necessary commands to deploy {{ image_name }} to {{ space }}".

# build and deploy to all stages
yolo: build (deploy "dev") (deploy "staging") (deploy "prod")
