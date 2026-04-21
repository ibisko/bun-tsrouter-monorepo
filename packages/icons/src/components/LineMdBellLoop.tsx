import type { SVGProps } from 'react';

/** line-md:bell-loop */
export function LineMdBellLoop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="4" d="M12 3v2">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="4;0" />
          <animateTransform
            attributeName="transform"
            dur="6s"
            keyTimes="0;0.05;0.15;0.2;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 3;3 12 3;-3 12 3;0 12 3;0 12 3"
          />
        </path>
        <path
          strokeDasharray="30"
          strokeDashoffset="30"
          d="M12 5c-3.31 0 -6 2.69 -6 6l0 6c-1 0 -2 1 -2 2h8M12 5c3.31 0 6 2.69 6 6l0 6c1 0 2 1 2 2h-8">
          <animateTransform
            attributeName="transform"
            dur="6s"
            keyTimes="0;0.05;0.15;0.2;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 3;3 12 3;-3 12 3;0 12 3;0 12 3"
          />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.4s" to="0" />
        </path>
        <path strokeDasharray="10" strokeDashoffset="10" d="M10 20c0 1.1 0.9 2 2 2c1.1 0 2 -0.9 2 -2">
          <animateTransform
            attributeName="transform"
            begin="0.2s"
            dur="6s"
            keyTimes="0;0.05;0.15;0.2;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 8;6 12 8;-6 12 8;0 12 8;0 12 8"
          />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0" />
        </path>
      </g>
    </svg>
  );
}
