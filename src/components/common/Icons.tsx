interface IconProps {
  className?: string;
}

export const ChevronDownIcon = ({ className = '' }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.1937 12.2522L7.11728 8.83402C6.94353 8.64097 7.08053 8.33333 7.34027 8.33333H13.493C13.7528 8.33333 13.8898 8.64097 13.716 8.83402L10.6396 12.2522C10.5205 12.3846 10.3128 12.3846 10.1937 12.2522Z"
      fill="currentColor"
    />
  </svg>
);

export const XIcon = ({ className = '' }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13.5 6.5L6.5 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 6.5L13.5 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
