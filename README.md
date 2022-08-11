<a name="readme-top"></a>
[![Build Status][build-badge]][build-status]
[![Coverage Status][coverage-badge]][coverage-status]

# Metadata Assignment GUI Providing Ingest and Export UI

An Angular UI frontend for the *Metadata Assignment GUI Providing Ingest and Export (MAGPIE) Service* developed and maintained by [Texas A&M University Libraries][tamu-library].

The initial design focus is on scanned dissertations with output of [DSpace][dspace-url] ingestable SAF.

Includes ability to assume users' netids.

<div align="right">(<a href="#readme-top">back to top</a>)</div>


## User Documentation

**Manage Users**
  - Change role of users.
  - Limited to role of self.
  - Assign documents to users.

**Manage Documents**

  - Claim documents as an annotator.
  - Assign documents to managers or annatators as admin or managers.

**Annotate Documents**

  - Annotate abstract and committee member metadata of documents.

<div align="right">(<a href="#readme-top">back to top</a>)</div>


## Deployment

For a quick and easy deployment using `docker-compose` consider using the [Scanned Document Metadata Assignment Tool App Repo][app-repo].

For _advanced use cases_, or when `docker-compose` is unavailable, the UI may be either started using `docker` directly or even manually started.
This process is further described in the [Deployment Guide][deployment-guide].

<div align="right">(<a href="#readme-top">back to top</a>)</div>


## Additional Resources

- [Contributors Documentation][contribute-guide]
- [Deployment Documentation][deployment-guide]

Please feel free to file any issues concerning *Metadata Assignment GUI Providing Ingest and Export UI* to the issues section of the repository.

Any questions concerning *Metadata Assignment GUI Providing Ingest and Export UI* can be directed to helpdesk@library.tamu.edu.

Copyright © 2022 Texas A&M University Libraries under the [The MIT License][license].

<div align="right">(<a href="#readme-top">back to top</a>)</div>


<!-- LINKS -->
[build-status]: https://github.com/TAMULib/MagpieUI/actions?query=workflow%3ABuild
[build-badge]: https://github.com/TAMULib/MagpieUI/workflows/Build/badge.svg
[coverage-status]: https://coveralls.io/github/TAMULib/MagpieUI
[coverage-badge]: https://coveralls.io/repos/github/TAMULib/MagpieUI/badge.svg

[tamu-library]: http://library.tamu.edu
[app-repo]: https://github.com/TAMULib/Magpie
[dspace-url]: https://dspace.lyrasis.org/

[deployment-guide]: DEPLOYING.md
[contribute-guide]: CONTRIBUTING.md
[license]: LICENSE
