import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { userService } from '@/services/userService';
import { Button, Switch } from '@/components/ui';
import { getImageUrl } from '@/utils/image';
import type { UserSettingsDTO } from '@/types';
import { normalizeLanguageCode } from '@/utils/i18nUtils';
import { DailyGoalSelector } from './DailyGoalSelector';
import styles from './Settings.module.css';
import clsx from 'clsx';

export const SettingsPage = () => {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  // ... existing code ...

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<UserSettingsDTO | null>(user?.settings || null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Daily Goal States
  const [dailyGoalValue, setDailyGoalValue] = useState<number>(user?.settings?.dailyGoal || 10);
  const [showSavedGoal, setShowSavedGoal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await userService.getSettings();
        if (res.success) {
          setSettings(res.data);
          setDailyGoalValue(res.data.dailyGoal);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleGhostModeToggle = async (checked: boolean) => {
    if (!settings) return;
    try {
      setLoadingAction('ghost');
      // Optimistic update
      const newStatus = checked;
      setSettings(prev => prev ? { ...prev, enableGhostMode: newStatus } : null);
      
      await userService.updateGhostMode(newStatus);
      // setMessage({ type: 'success', text: t('settings.successGhostMode', { status: newStatus ? t('settings.enabled') : t('settings.disabled') }) });
      await refreshProfile();
    } catch {
       // Revert on failure
       setSettings(prev => prev ? { ...prev, enableGhostMode: !checked } : null);
       setMessage({ type: 'error', text: t('settings.errorGhostMode') });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDailyGoalUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    
    // Prevent spam: Don't save if value hasn't changed
    if (dailyGoalValue === settings.dailyGoal) return;

    try {
      setLoadingAction('dailyGoal');
      setShowSavedGoal(false);
      
      await userService.updateDailyGoal(dailyGoalValue);
      setSettings({ ...settings, dailyGoal: dailyGoalValue });
      
      // Show "Saved" feedback
      setShowSavedGoal(true);
      setTimeout(() => setShowSavedGoal(false), 2000);
      
      // setMessage({ type: 'success', text: t('settings.successDailyGoal') });
      await refreshProfile();
    } catch {
      setMessage({ type: 'error', text: t('settings.errorDailyGoal') });
    } finally {
      setLoadingAction(null);
    }
  };

   const handleLanguageUpdate = async (lang: string) => {
    if (!settings) return;
    
    // Normalize logic
    const currentLang = normalizeLanguageCode(settings.uiLanguage);
    if (normalizeLanguageCode(lang) === currentLang) return; // Prevent redundant request

    try {
      setLoadingAction('language');
      // Update locally immediately for responsiveness
      i18n.changeLanguage(lang);
      
      await userService.updateLanguage(lang);
      setSettings({ ...settings, uiLanguage: lang });
       setMessage({ type: 'success', text: t('settings.successLanguage') });
      // await refreshProfile(); // Removed to prevent race condition reverting language
    } catch {
       setMessage({ type: 'error', text: t('settings.errorLanguage') });
       // Revert if failed? Or just keep it.
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingAction('avatar');
      await userService.uploadAvatar(file);
      await refreshProfile(); // Refresh user context to get new avatarUrl
      setMessage({ type: 'success', text: t('settings.successAvatar') });
    } catch {
      setMessage({ type: 'error', text: t('settings.errorAvatar') });
    } finally {
      setLoadingAction(null);
      // Clear input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!settings || !user) return <div>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('settings.title')}</h1>
      
      {message && (
        <div className={clsx(styles.message, message.type === 'success' ? styles.success : styles.error)}>
          {message.text}
        </div>
      )}

      {/* SECTION 1: PROFILE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('settings.profile')}</h2>
        <div className={styles.card}>
           <div className={styles.profileRow}>
             <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                {user.avatarUrl ? (
                  <img src={getImageUrl(user.avatarUrl)} alt="Avatar" className={styles.profileAvatar} />
                ) : (
                  <div className={styles.profileAvatarPlaceholder}>{user.username.charAt(0).toUpperCase()}</div>
                )}
                <div className={styles.avatarOverlay}>{t('settings.changeAvatar')}</div>
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               style={{ display: 'none' }} 
               accept="image/*"
             />
             <div className={styles.profileInfo}>
               <h3 className={styles.profileName}>{user.username}</h3>
               <p className={styles.profileEmail}>{user.email}</p>
             </div>
           </div>
        </div>
      </section>

      {/* SECTION 2: APPEARANCE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('settings.appearance')}</h2>
        
        {/* Theme Selection */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('settings.theme')}</h3>
          <p className={clsx(styles.cardDescription, styles.mb4)}>{t('settings.themeDesc')}</p>
          <div className={styles.themeGrid}>
             {[
               { id: 'light', name: t('settings.themeLight'), color: '#fffefb' },
               { id: 'dark', name: t('settings.themeDark'), color: '#1a1a1a' },
               { id: 'retro', name: t('settings.themeRetro'), color: '#fdf6e3' }
             ].map((tOption) => (
                <div 
                  key={tOption.id} 
                  className={clsx(styles.themeCard, theme === tOption.id && styles.activeTheme)}
                  onClick={() => setTheme(tOption.id as 'light' | 'dark' | 'retro')}
                >
                   <div className={styles.themePreview} style={{ backgroundColor: tOption.color }}>
                     <div className={styles.themePreviewDot}></div>
                   </div>
                   <span className={styles.themeName}>{tOption.name}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Language */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('settings.language')}</h3>
          <p className={clsx(styles.cardDescription, styles.mb4)}>{t('settings.languageDesc')}</p>
            <div className={styles.buttonGroup}>
             {(() => {
               const rawLang = settings?.uiLanguage || user?.settings?.uiLanguage;
               const currentLanguage = normalizeLanguageCode(rawLang);

               return (
                 <>
                   <Button 
                     variant={currentLanguage === 'en' ? 'primary' : 'outline'}
                     onClick={() => handleLanguageUpdate('en')}
                     isLoading={loadingAction === 'language' && currentLanguage !== 'en'}
                     disabled={loadingAction !== null}
                   >
                     English
                   </Button>
                   <Button 
                     variant={currentLanguage === 'vi' ? 'primary' : 'outline'}
                     onClick={() => handleLanguageUpdate('vi')}
                     isLoading={loadingAction === 'language' && currentLanguage !== 'vi'}
                     disabled={loadingAction !== null}
                   >
                     Tiếng Việt
                   </Button>
                 </>
               );
             })()}
           </div>
        </div>
      </section>

      {/* SECTION 3: PREFERENCES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('settings.preferences')}</h2>
        {/* Ghost Reviews */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>{t('settings.ghostMode')}</h3>
              <p className={styles.cardDescription}>{t('settings.ghostModeDesc')}</p>
            </div>
            <Switch
              checked={settings.enableGhostMode}
              onCheckedChange={handleGhostModeToggle}
              disabled={loadingAction === 'ghost'}
            />
          </div>
        </div>

        {/* Daily Goal */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('settings.dailyGoal')}</h3>
          <p className={clsx(styles.cardDescription, styles.mb4)}>{t('settings.dailyGoalDesc')}</p>
          
          <form onSubmit={handleDailyGoalUpdate}>
            <DailyGoalSelector 
              value={dailyGoalValue}
              onChange={setDailyGoalValue}
              disabled={loadingAction === 'dailyGoal'}
            />
            
            <div className={styles.formRow} style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
               <Button 
                type="submit" 
                isLoading={loadingAction === 'dailyGoal'} 
                disabled={loadingAction !== null || dailyGoalValue === settings.dailyGoal}
                variant={showSavedGoal ? 'outline' : 'primary'}
                className={styles.saveButton}
              >
                {showSavedGoal ? 'Saved ✓' : t('settings.save')}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 4: ACCOUNT */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('settings.account')}</h2>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>{t('common.logout')}</h3>
              <p className={styles.cardDescription}>{t('settings.logoutDesc')}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
