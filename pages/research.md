---
layout: layouts/research.njk
eleventyNavigation:
  key: Research
  order: 4
permalink: /research/
---

# Research topic

## Overview
My PhD topic is "Toward a smarter data management on the IoT". I work on interoperability issues in the IoT, and I focus on scalability and distribution of the SWoT (Semantic Web of Things). In order to integrate the human user at the center of the IoT, the use of semantic web and natural language processing technologies are also a domain I am interested in. My PhD thesis is soon to be released publicly, and the defense is already [available online](https://peertube.fr/videos/watch/b64093d5-9d24-4e8d-9ca4-e023aa95a65a) (I apologize for my poor accent, I was a little stressed ^^). The [slides for the defense]({filename}/docs/presentations/2018_11_soutenance.pdf) are available as well.

## Semantic Web for interoperability in the IoT

The main drive for the emergence of the SWoT (Semantic Web of Things) is the need for interoperability, caused by the heterogeneity of software, hardware and use cases involved in the IoT domain. One of my PhD contributions was to propose an IoT ontology, IoT-O, as well as quality criteria for existing Iot ontologies. This ontology was used in a autonomic control application, semIoTics, for a connected appartment.

## Distributed reasoning for scaling the Semantic Web of Things

The development of the SWoT requires the integration of Semantic Web technologies into IoT networks. Due to the constrained nature of IoT devices, as well as the scale at which IoT data is collected, such integration is challenging. In order to propose a scalable solution, I proposed an approach to dynamically distribute semantic reasonning among Fog nodes in order to bring computation closer to data sources, called EDR. The purpose of EDR is to be generic, and instanciated with different strategies as described below.

- **EDR for property types**: The first strategy for EDR is to try and get the rules as deep as possible in the network, as long as the data consumed by the rule (e.g. temperature+luminosity->comfort) are available in the network where the rule is propagated. This strategy is described in [@COOPIS2018].
- **EDR for privacy-awareness**: I am currently (meaning 2019) supervising an intern working on a different rule propagation strategy. The idea is that instead of giving your data to a service provider in order to get the service, you might want the service to be deployed on your own premises. In order to make the decision of where to locate the service (here implemented as rules), nodes need to be aware of the trust between agents in the network: to whom can they send their data, and to whom should they propagate their rules ? For decentralized storage of chains of trust and data, we use [SOLID](https://solid.inrupt.com/).
- **EDR for constrained systems**: I am currently (meaning 2019) supervising an intern working on adaptations of EDR in order to extend its support on constrained devices. In particular, the HTTP communication is replaced with CoAP, and messages are encoded in a compact RDF format.

# Projects

## oneM2M, and its open implementation OM2M
oneM2M is an industrial consortium centered on the eponym horizontal IoT standard. I contributed to the development of the standard ontology, and I was also part of an expert commitee from oneM2M and the W3C that came together to write a joint whitepaper [@whitepaper2016].
During my PhD, I implemented the semantic functionalities of oneM2M into [OM2M](http://eclipse.org/om2m), a free (as in freedom) implementation of the standard.

## FIESTA-IoT
I was part of the team at LAAS-CNRS that offered a testbed to the FIESTA-IoT project. Our work in this project lead to a journal publication co-authored with the partners [@sensors2018].

## Open Platform for Adream
The OPA project aimed a making data produced in the ADREAM building (a smart building equipped with over 6500 sensors) available as open data. The obtained open data is available [there](https://syndream.laas.fr:8082/ "ADREAM Open data"). Please note that it is served on the 8082 port, which may be blocked by some firewalls. An overview of the architecture for the publication is available in the first slides of [this presentation]({filename}/docs/presentations/2019-06_RoD-MADICS.pdf}), and I'm available for further questions.