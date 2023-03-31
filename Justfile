service_name := "wishing-wells"
git_revision := `git rev-parse --short HEAD`
image_tag := git_revision
image_name := "docker-repository" / service_name

# run tasks for continuos integration
ci:
    npm ci
    npm run tsc
    npm run prettier
    # currently no tests…
    npm run test

# build image (with buildkit)
build:
    buildctl build \
      --frontend dockerfile.v0 \
      --output type=image,\"name={{image_name}},{{image_name}}:{{ image_tag }}\",push=true \
      --export-cache type=registry,ref={{image_name}}:buildcache \
      --import-cache type=registry,ref={{image_name}}:buildcache \
      --opt label:git-revision={{git_revision}} \
      --opt build-arg:GIT_REVISION={{ git_revision }} \
      --local context=. \
      --local dockerfile=.

# inspect the git-revision of the image tagged with latest
inspect_latest:
    @docker pull -q {{ image_name }}:latest > /dev/null
    @docker inspect --format '{{{{ index .Config.Labels "git-revision" }}' {{ image_name }}:latest

# deploy the image
deploy space="dev" tag="latest":
    echo "execute necessary commands to deploy {{ image_name }}:$(([ {{ tag }} = "latest" ] && just inspect_latest || echo {{ tag }}) to {{ space }}".

# build and deploy to all stages
yolo: build (deploy "dev") (deploy "staging") (deploy "prod")
