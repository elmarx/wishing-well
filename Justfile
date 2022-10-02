service_name := "wishing-wells"
git_revision := `git rev-parse --short HEAD`
image_tag := git_revision
image_name := "de.icr.io/mate" / service_name

# run docker build
build:
    docker buildx build \
        --push \
        --pull \
        --label git-revision={{git_revision}} \
        -t {{image_name}} \
        -t {{image_name}}:{{ image_tag }} \
        .

select space="dev":
    #!/bin/sh
    set -ue

    case {{ space }} in
        "dev")
            ibmcloud target -g dev
            ibmcloud ce project select -n tools-dev
            ;;
        "staging")
            ibmcloud target -g staging
            ibmcloud ce project select -n tools-staging
            ;;
        "prod")
            ibmcloud target -g default
            ibmcloud ce project select -n tools-prod
            ;;
        *)
            echo "Invalid environment: dev, staging or prod expected"
            exit 1
            ;;
    esac

# deploy the image with terraform
deploy space="dev" tag="latest": (select space)
    #!/bin/sh

    if [ "{{ tag }}" = "latest" ]; then
      docker pull {{ image_name }}:latest
      TAG=$(docker inspect --format '{{{{ index .Config.Labels "git-revision" }}' {{ image_name }}:latest)
    fi

    ibmcloud ce app update -n {{ service_name }} -i private.{{ image_name }}:${TAG:-"latest"}

# build and deploy to all stages
yolo: build (deploy "dev") (deploy "staging") (deploy "prod")
