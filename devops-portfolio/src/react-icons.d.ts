import { JSX } from 'react';

declare module 'react-icons/lib' {
  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = (props: IconBaseProps) => JSX.Element;
}

declare module 'react-icons/fa' {
  import { IconType } from 'react-icons/lib';
  export const FaEnvelope: IconType;
  export const FaPhone: IconType;
  export const FaMapMarkerAlt: IconType;
  export const FaLinkedin: IconType;
  export const FaGithub: IconType;
  export const FaTwitter: IconType;
  export const FaHeart: IconType;
  export const FaAws: IconType;
  export const FaDocker: IconType;
  export const FaCode: IconType;
  export const FaGitAlt: IconType;
  export const FaPython: IconType;
  export const FaLinux: IconType;
  export const FaNode: IconType;
}

declare module 'react-icons/si' {
  import { IconType } from 'react-icons/lib';
  export const SiTerraform: IconType;
  export const SiKubernetes: IconType;
  export const SiNginx: IconType;
  export const SiGithubactions: IconType;
  export const SiJenkins: IconType;
  export const SiPrometheus: IconType;
  export const SiGrafana: IconType;
  export const SiJavascript: IconType;
  export const SiReact: IconType;
  export const SiAnsible: IconType;
}
