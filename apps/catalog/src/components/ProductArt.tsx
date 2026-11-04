import { cx } from '@mfe/ui';

/** "Ilustração" do produto: o emoji sobre uma placa com padrão de carta náutica. */
export function ProductArt({ emoji, large = false }: { emoji: string; large?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'grid place-items-center rounded-[10px] bg-sea-wash',
        'bg-[radial-gradient(circle_at_center,rgb(31_111_120/0.14)_1px,transparent_1px)] bg-size-[14px_14px]',
        large ? 'aspect-square text-[9rem]' : 'aspect-[16/10] text-7xl',
      )}
    >
      <span className="drop-shadow-[0_6px_8px_rgb(20_35_43/0.18)]">{emoji}</span>
    </div>
  );
}
