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

# inspect the git-revision of the image tagged with latest
inspect_latest:
    @docker pull -q {{ image_name }}:latest > /dev/null
    @docker inspect --format '{{{{ index .Config.Labels "git-revision" }}' {{ image_name }}:latest

# deploy the image
deploy space="dev" tag="latest":
    echo "execute necessary commands to deploy {{ image_name }}:$(([ {{ tag }} = "latest" ] && just inspect_latest || echo {{ tag }}) to {{ space }}".

# build and deploy to all stages
yolo: build (deploy "dev") (deploy "staging") (deploy "prod")
