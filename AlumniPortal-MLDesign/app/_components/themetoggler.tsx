'use client'
import { useAppDispatch, useAppSelector } from '@/redux-toolkit/hooks'
import { toggleTheme } from '@/redux-toolkit/features/theme-selector'

export default function ThemeToggler() {
    const dispatch = useAppDispatch()
    const modeColor = useAppSelector((state) => state.theme.mode)
    return modeColor === 'light' ? (
        <button onClick={() => dispatch(toggleTheme())}>
            <span className="material-symbols-outlined text-black">
                dark_mode
            </span>
        </button>
    ) : (
        <button onClick={() => dispatch(toggleTheme())}>
            <span className="material-symbols-outlined text-white">
                light_mode
            </span>
        </button>
    )
}
