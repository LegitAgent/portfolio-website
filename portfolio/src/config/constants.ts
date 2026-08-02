import gitHubIcon from '../assets/icons/github.svg';
import linkedInIcon from '../assets/icons/linkedin.svg';
import emailIcon from '../assets/icons/email.svg';
import resumeIcon from '../assets/icons/resume.svg';
import profilePicture from '../assets/images/website_pic.jpg';
import folder from '../assets/icons/folder.svg';
import leetcode from '../assets/icons/leetcode.svg';
import stack from '../assets/icons/stack.svg';

import aws from '../assets/icons/aws.svg';
import cloudflare from '../assets/icons/cloudflare.svg';
import cpp from '../assets/icons/cpp.svg';
import css from '../assets/icons/css.svg';
import django from '../assets/icons/django.svg';
import docker from '../assets/icons/docker.svg';
import git from '../assets/icons/git.svg';
import graphql from '../assets/icons/graphql.svg';
import html from '../assets/icons/html.svg';
import java from '../assets/icons/java.svg';
import javascript from '../assets/icons/javascript.svg';
import laravel from '../assets/icons/laravel.svg';
import nodejs from '../assets/icons/nodejs.svg';
import npm from '../assets/icons/npm.svg';
import php from '../assets/icons/php.svg';
import pip from '../assets/icons/pip.svg';
import postgresql from '../assets/icons/postgresql.svg';
import python from '../assets/icons/python.svg';
import react from '../assets/icons/react.svg';
import rest from '../assets/icons/rest.svg';
import sql from '../assets/icons/sql.svg';
import tailwind from '../assets/icons/tailwind.svg';
import typescript from '../assets/icons/typescript.svg';
import vite from '../assets/icons/vite.svg';
import unavailable_image from '../assets/icons/unavailable_image.svg';

import skills from '../assets/icons/skills.svg';
import code from '../assets/icons/code.svg';
import certificate from '../assets/icons/certificate.svg';

// image locations
export const GITHUB_ICON = gitHubIcon;
export const LINKEDIN_ICON = linkedInIcon;
export const EMAIL_ICON = emailIcon;
export const RESUME_ICON = resumeIcon;
export const PROFILE_PICTURE = profilePicture;
export const FOLDER_ICON = folder;
export const LEETCODE_ICON = leetcode;
export const STACK_ICON = stack;

export const AWS = aws;
export const CLOUDFLARE = cloudflare;
export const CPP = cpp;
export const CSS = css;
export const DJANGO = django;
export const DOCKER = docker;
export const GIT = git;
export const GRAPHQL = graphql;
export const HTML = html;
export const JAVA = java;
export const JAVASCRIPT = javascript;
export const LARAVEL = laravel;
export const NODEJS = nodejs;
export const NPM = npm;
export const PHP = php;
export const PIP = pip;
export const POSTGRESQL = postgresql;
export const PYTHON = python;
export const REACT = react;
export const REST = rest;
export const SQL = sql;
export const TAILWIND = tailwind;
export const TYPESCRIPT = typescript;
export const VITE = vite;
export const NO_IMAGE = unavailable_image;

export const SKILLS = skills;
export const CODE = code;
export const CERTIFICATE = certificate;

// URL's
export const GITHUB_URL = 'https://github.com/LegitAgent';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/martin-darius-alba-836826294/';
export const CLOUDFLARE_GATEWAY = 'https://api.martinalba.dev/';
export const CLOUDFLARE_R2_BUCKET = 'https://pub-301ee5c2e9c34bb9961b75fd092e680d.r2.dev/';

// updatables
export const RESUME_NAME = '/resume-03-01-2026.pdf';

const NO = 0;
const MAYBE = 1;
const YES = 2;
export const AVAILABILITY_LABELS = {
  [NO]: 'No',
  [MAYBE]: 'Maybe',
  [YES]: 'Yes',
} as const;
export const POSITION_AVAILABILITY = NO;
export const COLLAB_AVAILABILITY = YES;
export const FREELANCE_AVAILABILITY = YES;

export const POSITION_DESC = 'I am currently working as a backend developer intern in Hackazouk.';
export const COLLAB_DESC = 'I am open to thoughtful project collaborations and hackathons focused on building useful, reliable software.';
export const FREELANCE_DESC = 'I am available for scoped website and software projects where the requirements, timeline, and expected outcomes are clear.';
