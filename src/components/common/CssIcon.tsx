import React from 'react';

export type IconName =
  | 'search'
  | 'download'
  | 'star'
  | 'star-filled'
  | 'check'
  | 'heart'
  | 'heart-filled'
  | 'close'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'chevron-up'
  | 'shield'
  | 'user'
  | 'lock'
  | 'sliders'
  | 'grid'
  | 'library'
  | 'bell'
  | 'logout'
  | 'plus'
  | 'sparkle'
  | 'terminal'
  | 'folder'
  | 'trash'
  | 'play'
  | 'pause'
  | 'copy'
  | 'external'
  | 'filter'
  | 'refresh';

interface CssIconProps {
  name: IconName;
  size?: number; // pixel bounding box, e.g. 16, 18, 20
  className?: string;
  color?: string; // CSS color string or inherits currentColor
}

/**
 * Pure CSS Icon component with ZERO SVG and ZERO emojis.
 * Implemented exclusively using geometric HTML/CSS rendering with precise line-heights,
 * borders, transforms, and clip-paths.
 */
export const CssIcon: React.FC<CssIconProps> = ({
  name,
  size = 18,
  className = '',
  color = 'currentColor',
}) => {
  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
    color,
    userSelect: 'none',
  };

  const renderIconContent = () => {
    switch (name) {
      case 'search':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Magnifier lens circle */}
            <div
              style={{
                width: size * 0.62,
                height: size * 0.62,
                border: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderRadius: '9999px',
                transform: `translate(-${size * 0.12}px, -${size * 0.12}px)`,
              }}
            />
            {/* Magnifier handle bar */}
            <div
              style={{
                width: size * 0.36,
                height: Math.max(1.5, size * 0.1),
                backgroundColor: 'currentColor',
                borderRadius: '2px',
                position: 'absolute',
                transform: 'rotate(45deg)',
                right: size * 0.08,
                bottom: size * 0.16,
                transformOrigin: 'left center',
              }}
            />
          </div>
        );

      case 'download':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Downward stem */}
            <div
              style={{
                width: Math.max(1.5, size * 0.11),
                height: size * 0.52,
                backgroundColor: 'currentColor',
                position: 'absolute',
                top: size * 0.12,
              }}
            />
            {/* Arrowhead chevron pointing down */}
            <div
              style={{
                width: size * 0.36,
                height: size * 0.36,
                borderRight: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                borderBottom: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                transform: 'rotate(45deg)',
                position: 'absolute',
                top: size * 0.28,
              }}
            />
            {/* Base tray bracket */}
            <div
              style={{
                width: size * 0.72,
                height: size * 0.24,
                borderLeft: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderRight: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderBottom: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                position: 'absolute',
                bottom: size * 0.1,
                borderBottomLeftRadius: '2px',
                borderBottomRightRadius: '2px',
              }}
            />
          </div>
        );

      case 'star':
      case 'star-filled': {
        const isFilled = name === 'star-filled';
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.72,
                height: size * 0.72,
                backgroundColor: isFilled ? 'currentColor' : 'transparent',
                border: isFilled ? 'none' : `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                clipPath:
                  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              }}
            />
          </div>
        );
      }

      case 'heart':
      case 'heart-filled': {
        const isFilled = name === 'heart-filled';
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.68,
                height: size * 0.68,
                backgroundColor: isFilled ? 'currentColor' : 'transparent',
                border: isFilled ? 'none' : `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                clipPath:
                  'polygon(50% 88%, 15% 55%, 5% 30%, 15% 12%, 35% 12%, 50% 28%, 65% 12%, 85% 12%, 95% 30%, 85% 55%)',
              }}
            />
          </div>
        );
      }

      case 'check':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.32,
                height: size * 0.58,
                borderRight: `${Math.max(2, size * 0.12)}px solid currentColor`,
                borderBottom: `${Math.max(2, size * 0.12)}px solid currentColor`,
                transform: 'rotate(45deg) translate(-1px, -2px)',
              }}
            />
          </div>
        );

      case 'close':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.65,
                height: Math.max(1.5, size * 0.11),
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                position: 'absolute',
                transform: 'rotate(45deg)',
              }}
            />
            <div
              style={{
                width: size * 0.65,
                height: Math.max(1.5, size * 0.11),
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                position: 'absolute',
                transform: 'rotate(-45deg)',
              }}
            />
          </div>
        );

      case 'chevron-right':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.38,
                height: size * 0.38,
                borderTop: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                borderRight: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                transform: 'rotate(45deg) translateX(-1px)',
              }}
            />
          </div>
        );

      case 'chevron-left':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.38,
                height: size * 0.38,
                borderBottom: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                borderLeft: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                transform: 'rotate(45deg) translateX(1px)',
              }}
            />
          </div>
        );

      case 'chevron-down':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.38,
                height: size * 0.38,
                borderBottom: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                borderRight: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                transform: 'rotate(45deg) translateY(-2px)',
              }}
            />
          </div>
        );

      case 'chevron-up':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.38,
                height: size * 0.38,
                borderTop: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                borderLeft: `${Math.max(1.5, size * 0.11)}px solid currentColor`,
                transform: 'rotate(45deg) translateY(2px)',
              }}
            />
          </div>
        );

      case 'shield':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.65,
                height: size * 0.75,
                border: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderTopLeftRadius: '2px',
                borderTopRightRadius: '2px',
                borderBottomLeftRadius: `${size * 0.32}px`,
                borderBottomRightRadius: `${size * 0.32}px`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: size * 0.2,
                  height: size * 0.32,
                  borderRight: `${Math.max(1.5, size * 0.09)}px solid currentColor`,
                  borderBottom: `${Math.max(1.5, size * 0.09)}px solid currentColor`,
                  transform: 'rotate(45deg) translate(0px, 0px)',
                  margin: `${size * 0.1}px auto 0`,
                }}
              />
            </div>
          </div>
        );

      case 'user':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Head */}
            <div
              style={{
                width: size * 0.36,
                height: size * 0.36,
                borderRadius: '9999px',
                border: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                marginBottom: size * 0.06,
              }}
            />
            {/* Shoulders */}
            <div
              style={{
                width: size * 0.66,
                height: size * 0.28,
                borderTopLeftRadius: size * 0.2,
                borderTopRightRadius: size * 0.2,
                border: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderBottom: 'none',
              }}
            />
          </div>
        );

      case 'lock':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Shackle */}
            <div
              style={{
                width: size * 0.36,
                height: size * 0.32,
                borderTopLeftRadius: '9999px',
                borderTopRightRadius: '9999px',
                border: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderBottom: 'none',
                marginBottom: -1,
              }}
            />
            {/* Lock body */}
            <div
              style={{
                width: size * 0.58,
                height: size * 0.44,
                borderRadius: '2px',
                border: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: size * 0.1,
                  height: size * 0.16,
                  backgroundColor: 'currentColor',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '1px',
                }}
              />
            </div>
          </div>
        );

      case 'sliders':
      case 'filter':
        return (
          <div className="relative w-full h-full flex flex-col justify-around py-1 px-1">
            <div className="relative w-full h-[2px] bg-neutral-600">
              <div
                style={{
                  width: size * 0.22,
                  height: size * 0.22,
                  backgroundColor: 'currentColor',
                  borderRadius: '9999px',
                  position: 'absolute',
                  left: '25%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
            <div className="relative w-full h-[2px] bg-neutral-600">
              <div
                style={{
                  width: size * 0.22,
                  height: size * 0.22,
                  backgroundColor: 'currentColor',
                  borderRadius: '9999px',
                  position: 'absolute',
                  left: '70%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
            <div className="relative w-full h-[2px] bg-neutral-600">
              <div
                style={{
                  width: size * 0.22,
                  height: size * 0.22,
                  backgroundColor: 'currentColor',
                  borderRadius: '9999px',
                  position: 'absolute',
                  left: '45%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div
            className="grid grid-cols-2 gap-[2px]"
            style={{ width: size * 0.72, height: size * 0.72 }}
          >
            <div className="border border-current rounded-[1px]" />
            <div className="border border-current rounded-[1px]" />
            <div className="border border-current rounded-[1px]" />
            <div className="border border-current rounded-[1px]" />
          </div>
        );

      case 'library':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 3 tilted / vertical books */}
            <div
              style={{
                width: size * 0.16,
                height: size * 0.62,
                border: `${Math.max(1.2, size * 0.08)}px solid currentColor`,
                borderRadius: '1px',
                position: 'absolute',
                left: size * 0.15,
              }}
            />
            <div
              style={{
                width: size * 0.16,
                height: size * 0.62,
                border: `${Math.max(1.2, size * 0.08)}px solid currentColor`,
                borderRadius: '1px',
                position: 'absolute',
                left: size * 0.38,
              }}
            />
            <div
              style={{
                width: size * 0.16,
                height: size * 0.6,
                border: `${Math.max(1.2, size * 0.08)}px solid currentColor`,
                borderRadius: '1px',
                position: 'absolute',
                left: size * 0.62,
                transform: 'rotate(14deg)',
                transformOrigin: 'bottom left',
              }}
            />
          </div>
        );

      case 'bell':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div
              style={{
                width: size * 0.54,
                height: size * 0.52,
                border: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderTopLeftRadius: '9999px',
                borderTopRightRadius: '9999px',
                borderBottom: 'none',
              }}
            />
            <div
              style={{
                width: size * 0.72,
                height: Math.max(1.5, size * 0.1),
                backgroundColor: 'currentColor',
                borderRadius: '1px',
              }}
            />
            <div
              style={{
                width: size * 0.18,
                height: size * 0.12,
                borderBottomLeftRadius: '9999px',
                borderBottomRightRadius: '9999px',
                backgroundColor: 'currentColor',
                marginTop: 1,
              }}
            />
          </div>
        );

      case 'logout':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Bracket */}
            <div
              style={{
                width: size * 0.44,
                height: size * 0.64,
                borderTop: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderLeft: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderBottom: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderTopLeftRadius: '2px',
                borderBottomLeftRadius: '2px',
                position: 'absolute',
                left: size * 0.12,
              }}
            />
            {/* Arrow line */}
            <div
              style={{
                width: size * 0.45,
                height: Math.max(1.5, size * 0.1),
                backgroundColor: 'currentColor',
                position: 'absolute',
                right: size * 0.16,
              }}
            />
            {/* Arrow point */}
            <div
              style={{
                width: size * 0.24,
                height: size * 0.24,
                borderTop: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderRight: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                transform: 'rotate(45deg)',
                position: 'absolute',
                right: size * 0.16,
              }}
            />
          </div>
        );

      case 'plus':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.62,
                height: Math.max(1.5, size * 0.11),
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                position: 'absolute',
              }}
            />
            <div
              style={{
                width: Math.max(1.5, size * 0.11),
                height: size * 0.62,
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                position: 'absolute',
              }}
            />
          </div>
        );

      case 'sparkle':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.64,
                height: size * 0.64,
                backgroundColor: 'currentColor',
                clipPath:
                  'polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)',
              }}
            />
          </div>
        );

      case 'terminal':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Terminal prompt angle */}
            <div
              style={{
                width: size * 0.28,
                height: size * 0.28,
                borderTop: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                borderRight: `${Math.max(1.5, size * 0.1)}px solid currentColor`,
                transform: 'rotate(45deg)',
                position: 'absolute',
                left: size * 0.18,
              }}
            />
            {/* Cursor line */}
            <div
              style={{
                width: size * 0.28,
                height: Math.max(1.5, size * 0.11),
                backgroundColor: 'currentColor',
                position: 'absolute',
                bottom: size * 0.28,
                right: size * 0.18,
              }}
            />
          </div>
        );

      case 'folder':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.76,
                height: size * 0.54,
                border: `${Math.max(1.4, size * 0.09)}px solid currentColor`,
                borderRadius: '2px',
                position: 'relative',
              }}
            >
              {/* Folder tab */}
              <div
                style={{
                  width: size * 0.32,
                  height: size * 0.14,
                  backgroundColor: 'currentColor',
                  position: 'absolute',
                  top: -size * 0.14,
                  left: -Math.max(1.4, size * 0.09),
                  borderTopLeftRadius: '2px',
                  borderTopRightRadius: '2px',
                }}
              />
            </div>
          </div>
        );

      case 'trash':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Lid */}
            <div
              style={{
                width: size * 0.68,
                height: Math.max(1.5, size * 0.1),
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                marginBottom: 1,
              }}
            />
            {/* Can */}
            <div
              style={{
                width: size * 0.52,
                height: size * 0.5,
                border: `${Math.max(1.4, size * 0.09)}px solid currentColor`,
                borderTop: 'none',
                borderBottomLeftRadius: '2px',
                borderBottomRightRadius: '2px',
                display: 'flex',
                justifyContent: 'space-evenly',
                paddingTop: 1,
              }}
            >
              <div
                style={{
                  width: Math.max(1, size * 0.07),
                  height: '70%',
                  backgroundColor: 'currentColor',
                }}
              />
              <div
                style={{
                  width: Math.max(1, size * 0.07),
                  height: '70%',
                  backgroundColor: 'currentColor',
                }}
              />
            </div>
          </div>
        );

      case 'play':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.56,
                height: size * 0.62,
                backgroundColor: 'currentColor',
                clipPath: 'polygon(15% 10%, 90% 50%, 15% 90%)',
              }}
            />
          </div>
        );

      case 'pause':
        return (
          <div className="relative w-full h-full flex items-center justify-center gap-[3px]">
            <div
              style={{
                width: size * 0.16,
                height: size * 0.56,
                backgroundColor: 'currentColor',
                borderRadius: '1px',
              }}
            />
            <div
              style={{
                width: size * 0.16,
                height: size * 0.56,
                backgroundColor: 'currentColor',
                borderRadius: '1px',
              }}
            />
          </div>
        );

      case 'copy':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Back square */}
            <div
              style={{
                width: size * 0.44,
                height: size * 0.44,
                border: `${Math.max(1.2, size * 0.08)}px solid currentColor`,
                borderRadius: '1px',
                position: 'absolute',
                top: size * 0.14,
                left: size * 0.14,
              }}
            />
            {/* Front square */}
            <div
              style={{
                width: size * 0.44,
                height: size * 0.44,
                border: `${Math.max(1.2, size * 0.08)}px solid currentColor`,
                backgroundColor: '#0a0a0a',
                borderRadius: '1px',
                position: 'absolute',
                bottom: size * 0.14,
                right: size * 0.14,
              }}
            />
          </div>
        );

      case 'external':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.52,
                height: size * 0.52,
                borderLeft: `${Math.max(1.3, size * 0.09)}px solid currentColor`,
                borderBottom: `${Math.max(1.3, size * 0.09)}px solid currentColor`,
                borderBottomLeftRadius: '2px',
                position: 'absolute',
                bottom: size * 0.14,
                left: size * 0.14,
              }}
            />
            {/* Arrow */}
            <div
              style={{
                width: size * 0.42,
                height: Math.max(1.3, size * 0.09),
                backgroundColor: 'currentColor',
                transform: 'rotate(-45deg)',
                position: 'absolute',
                top: size * 0.28,
                right: size * 0.16,
              }}
            />
            <div
              style={{
                width: size * 0.22,
                height: size * 0.22,
                borderTop: `${Math.max(1.3, size * 0.09)}px solid currentColor`,
                borderRight: `${Math.max(1.3, size * 0.09)}px solid currentColor`,
                position: 'absolute',
                top: size * 0.14,
                right: size * 0.14,
              }}
            />
          </div>
        );

      case 'refresh':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              style={{
                width: size * 0.62,
                height: size * 0.62,
                borderRadius: '9999px',
                border: `${Math.max(1.4, size * 0.1)}px solid currentColor`,
                borderTopColor: 'transparent',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: size * 0.2,
                  height: size * 0.2,
                  borderTop: `${Math.max(1.4, size * 0.1)}px solid currentColor`,
                  borderRight: `${Math.max(1.4, size * 0.1)}px solid currentColor`,
                  position: 'absolute',
                  top: -size * 0.08,
                  right: size * 0.05,
                  transform: 'rotate(25deg)',
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={containerStyle}
      aria-hidden="true"
    >
      {renderIconContent()}
    </span>
  );
};
