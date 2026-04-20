import { useSiteSettings } from '../context/SiteSettingsContext';

/**
 * Custom hook to format price based on site settings (admin toggle) and locale (INR).
 * Returns:
 * - formatPrice(amount): Function to format number to INR string, or return null if hidden.
 * - showPrice: Boolean indicating if prices should be shown globally.
 */
export const useCurrency = () => {
    const { showPrice } = useSiteSettings();

    const formatPrice = (amount) => {
        if (!amount) return null;

        // Always format to INR, but return null (or hidden) if showPrice is false.
        // However, some components might want to force show (like Admin).
        // So this hook mainly provides the formatter and the visibility state.

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return { formatPrice, showPrice };
};
