import { cn } from "@/lib/utils";

/**
 * BentoGrid Container
 * グリッドレイアウトの親コンテナ。
 * mdサイズ以上で3列、高さ自動調整のグリッドを作成します。
 */
export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

/**
 * BentoGrid Item
 * 個別のカードコンポーネント。
 * group/bento を使用し、カード全体へのホバー時に内部要素（テキスト等）を右にスライドさせる
 * マイクロインタラクションを実装しています。
 */
export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                // 基本スタイル: 角丸、背景白、シャドウ、ホバー時のシャドウ強調
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-sm p-4 bg-white border border-neutral-200 justify-between flex flex-col space-y-4",
                // ダークモード対応（将来用）
                "dark:bg-black dark:border-white/[0.2] dark:shadow-none",
                className
            )}
        >
            {/* 上部エリア（画像やグラフィック用） */}
            {header}

            {/* テキストエリア（ホバー時に右へ少し動く） */}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-sans font-bold text-neutral-800 dark:text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                    {description}
                </div>
            </div>
        </div>
    );
};