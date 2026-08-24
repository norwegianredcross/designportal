# Services

[[_TOC_]]

This folder contains all deployable application services for the platform.

Each service should live in its own subfolder under `services/` and include the files needed to build and deploy that service. In practice, that usually means application source code, a `Dockerfile`, and a `service.yaml` pipeline definition.

## Structure

```text
services/
	<service-name>/
		Dockerfile
		service.yaml
		...application files
```

## Add a Service

New services are added through the Azure DevOps add-service pipeline in `.pipelines/add-service.yaml.jinja`.

The pipeline runs Copier and applies the service template from:

[copier-add-service](https://dev.azure.com/RedCrossNorway/FrontendPlatform/_git/copier-add-service)

The generated service folder is created under `services/<service-name>/` and includes the base files needed to build and deploy the service.

At a minimum, the pipeline will:

- create a new service folder in `services/`
- open a pull request with the generated files
- create a CD pipeline that points to `services/<service-name>/service.yaml`

The Copier template currently includes files such as:

```text
{{ service_name }}/
	Dockerfile
	service.yaml
	app/
	bicep/
	components/
	public/
	package.json
	next.config.mjs
```

## Notes

- Keep each service self-contained.
- Use one folder per service.
- Service-specific configuration should stay with the service unless it is shared platform infrastructure.

Infrastructure for the shared Azure Container Apps platform is defined in the [infrastructure/README.md](../infrastructure/README.md).
