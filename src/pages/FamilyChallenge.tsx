import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectCard from '../components/SubjectCard';
import { UserGroupIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

// تعريف نوع البيانات للفريق
interface Team {
  name: string;
  avatar: string;
}

// بيانات المواد من الصفحة الرئيسية مع تصنيف category
const subjectsData = {
  allSubjects: [
    { title: 'اللغة العربية', image: '', category: 'عام' },
    { title: 'اللغة الانجليزية', image: '', category: 'عام' },
    { title: 'رياضيات', image: '', category: 'عام' },
    { title: 'اجتماعيات', image: '', category: 'عام' },
    { title: 'علوم', image: '', category: 'عام' },
    { title: 'تربية اسرية', image: '', category: 'بنات' },
    { title: 'موسيقى', image: '', category: 'أصوات' },
    { title: 'نشيد', image: '', category: 'أصوات' },
    { title: 'طبخ', image: '', category: 'بنات' },
    // المواد الإسلامية الجديدة
    { title: 'السيرة النبوية', image: '/assets/subjects/islamic/sirah.png', category: 'اسلاميات' },
    { title: 'القرآن الكريم', image: '/assets/subjects/islamic/quran.png', category: 'اسلاميات' },
    { title: 'اسئلة اسلامية', image: '/assets/subjects/islamic/questions.png', category: 'اسلاميات' },
    { title: 'اناشيد اسلامية', image: '/assets/subjects/islamic/nasheed.png', category: 'اسلاميات' },
    { title: 'قصص الأنبياء', image: '/assets/subjects/islamic/prophets.png', category: 'اسلاميات' },
    // المواد الجديدة في عالم الفن
    { title: 'ممثلين خليجيين', image: '/assets/subjects/art/gulf-actors.png', category: 'عالم الفن' },
    { title: 'ممثلين bollywood', image: '/assets/subjects/art/bollywood-actors.png', category: 'عالم الفن' },
    { title: 'ممثلين اجانب', image: '/assets/subjects/art/foreign-actors.png', category: 'عالم الفن' },
    { title: 'خالتي قماشة', image: '/assets/subjects/art/khalti-qamasha.png', category: 'عالم الفن' },
    { title: 'أش أش', image: '/assets/subjects/art/ash-ash.png', category: 'عالم الفن' },
    { title: 'من عينه', image: '/assets/subjects/art/min-ayna.png', category: 'عالم الفن' },
    { title: 'رمضان 2025', image: '/assets/subjects/art/ramadan-2025.png', category: 'عالم الفن' },
    { title: 'رمضان شريف', image: '/assets/subjects/art/ramadan-sharif.png', category: 'عالم الفن' },
    { title: 'حكايات ابن الحداد', image: '/assets/subjects/art/ibn-al-haddad.png', category: 'عالم الفن' },
    { title: 'مافيا سكراب', image: '/assets/subjects/art/mafia-scrap.png', category: 'عالم الفن' },
    { title: 'اغاني', image: '/assets/subjects/art/songs.png', category: 'عالم الفن' },
  ]
};

const avatarImages = [
  '/assets/avatars/1.png',
  '/assets/avatars/2.png',
  '/assets/avatars/3.png',
  '/assets/avatars/4.png',
  '/assets/avatars/5.png',
  '/assets/avatars/6.png',
];

function getSubjectBackgroundColor(subjectTitle: string): string {
  switch (subjectTitle) {
    case 'اللغة العربية': return '#fef9f2';
    case 'اللغة الانجليزية': return '#fefaf5';
    case 'رياضيات': return '#fdf7f3';
    case 'اجتماعيات': return '#fef6e9';
    case 'علوم': return '#fffdf8';
    case 'تربية اسرية': return '#f9eddd';
    case 'موسيقى': return '#fefaf0';
    case 'نشيد': return '#fefaf0';
    case 'طبخ': return '#f9eddd';
    // الألوان الجديدة للمواد الإسلامية
    case 'السيرة النبوية': return '#fff5e5';
    case 'القرآن الكريم': return '#fffdf6';
    case 'اسئلة اسلامية': return '#fff7e8';
    case 'اناشيد اسلامية': return '#fffbf5';
    case 'قصص الأنبياء': return '#fff8e6';
    // الألوان الجديدة لمواد عالم الفن
    case 'ممثلين خليجيين': return '#fef7e8';
    case 'ممثلين bollywood': return '#fff5e5';
    case 'ممثلين اجانب': return '#fef9f2';
    case 'خالتي قماشة': return '#fffdf8';
    case 'أش أش': return '#fef7e8';
    case 'من عينه': return '#fff5e5';
    case 'رمضان 2025': return '#fef9f2';
    case 'رمضان شريف': return '#fffdf8';
    case 'حكايات ابن الحداد': return '#fef7e8';
    case 'مافيا سكراب': return '#fff5e5';
    case 'اغاني': return '#fef9f2';
    default: return '#fef7ee';
  }
}

const categories = [
  'عرض الكل',
  'اسلاميات',
  'عالم الفن',
  'أصوات',
  'بنات',
  'عام',
];

const gameNames = [
  'لمة العائلة', 'تحدي العيلة', 'أجواء الأهل', 'جلسة العائلة', 'لمة الأحباب', 'تحدي الأسرة', 'سهرات العيلة', 'تجمع الأهل', 'أمسيات العائلة', 'لمة ووناسة',
  'تحدي العائلة الكبير', 'ليلة الأصدقاء والأهل', 'لمة وذكريات', 'تحدي الضحك', 'لمة التحدي', 'أحلى جمعة', 'تحدي الأجيال', 'لمة السمر', 'تحدي العيلة الذهبي', 'لمة السعادة',
  'تحدي العائلة الممتع', 'لمة الفرح', 'تحدي العائلة الذكي', 'لمة التسلية', 'تحدي العائلة السريع', 'لمة التحدي العائلي', 'تحدي العائلة المرح', 'لمة الأبطال', 'تحدي العائلة الفريد', 'لمة الذكريات',
  'تحدي العائلة المميز', 'لمة الضحك', 'تحدي العائلة السحري', 'لمة المحبة', 'تحدي العائلة العجيب', 'لمة التحدي الذهبي', 'تحدي العائلة السعيد', 'لمة العائلة السعيدة', 'تحدي العائلة الفائز', 'لمة العائلة الذكية',
  'تحدي العائلة الجماعي', 'لمة العائلة الممتعة', 'تحدي العائلة السهرة', 'لمة العائلة الفريدة', 'تحدي العائلة الرائع', 'لمة العائلة المميزة', 'تحدي العائلة الترفيهي', 'لمة العائلة التنافسية', 'تحدي العائلة العصرية', 'لمة العائلة الحديثة',
  // أسماء المستخدم
  'سوالف آخر الليل',
  'الشلة الوناسة',
  'حزاوينا ما تخلص',
  'قعدة دريشة',
  'وين القهوة؟',
  'سوالف حبايب',
  'لمتنا غير',
  'جماعتنا عز',
  'جمعة هل الطيب',
  'سوالف وأكشن',
  'طقها والحقها',
  'سوالف بحرينية',
  'غبقة وعلوم',
  'قروب الوناسة',
  'ربع الدوانية',
  'سوالف لآخر الليل',
  'وين تبون نتمشى؟',
  'سوالف ومكسرات',
  'دوانية الخميس',
  'سوالفهم ما تنمل',
  'نخبة الطق',
  'قعدتنا ما تمل',
  'زوارة الحبايب',
  'لمة ولا أروع',
  'شلة طيبين',
  'سوالفنا عجيبة',
  'يا سلام على اللمة',
  'عز القعدة',
  'سوالف عزبة',
  'جمعتنا تكفي',
  'سوالف ناس فاضية',
  'سوالف وسحلب',
  'جمعة وبراد شاي',
  'ربعنا ذهب',
  'كلنا على بعض',
  'سوالف ومقالب',
  'أهل السوالف',
  'جمعة الخاطر',
  'قعدة ولا أحلى',
  'طق وسوالف',
  'ربع وصجبة',
  'سوالف بس',
  'دوانية ولا أطيب',
  'جمعة ناس فنانين',
  'سوالف آخر الدوام',
  'شلة السوالفية',
  'جمعة الصج',
  'من صبح الله',
  'سوالف ما تخلص',
  'جمعتنا بضحكة',
];

const FamilyChallenge = () => {
  const navigate = useNavigate();
  
  // قسم معلومات الفرق
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [availableAvatars, setAvailableAvatars] = useState(avatarImages);
  const [className, setClassName] = useState('');

  const addTeam = () => {
    if (teamNameInput.trim() !== '' && teams.length < 4 && availableAvatars.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableAvatars.length);
      const selectedAvatar = availableAvatars[randomIndex];
      setTeams([...teams, { name: teamNameInput.trim(), avatar: selectedAvatar }]);
      setAvailableAvatars(availableAvatars.filter(avatar => avatar !== selectedAvatar));
      setTeamNameInput('');
    }
  };
  const removeTeam = (index: number) => {
    const teamToRemove = teams[index];
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    setAvailableAvatars([...availableAvatars, teamToRemove.avatar]);
  };

  const handleStart = () => {
    // التحقق من أن جميع الفرق لديها أسماء
    const validTeams = teams.filter(team => team.name.trim() !== '');
    if (validTeams.length < 2) {
      alert('يجب إدخال اسمين فريقين على الأقل');
      return;
    }
    // حفظ أسماء الفرق واسم اللعبة في localStorage
    localStorage.setItem('teams', JSON.stringify(validTeams.map(t => t.name)));
    localStorage.setItem('className', className);
    // الانتقال إلى صفحة المسابقة
    navigate('/quiz');
  };

  const [selectedCategory, setSelectedCategory] = useState('عرض الكل');
  const filteredSubjects = selectedCategory === 'عرض الكل'
    ? subjectsData.allSubjects
    : subjectsData.allSubjects.filter(sub => sub.category === selectedCategory);
  const getCategoryCount = (cat: string) => {
    if (cat === 'عرض الكل') return subjectsData.allSubjects.length;
    return subjectsData.allSubjects.filter(sub => sub.category === cat).length;
  };

  const generateGameName = () => {
    const random = Math.floor(Math.random() * gameNames.length);
    setClassName(gameNames[random]);
  };

  const canStartGame = teams.length >= 2;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16" dir="rtl">
      <div className="container mb-12 subjects-section">
        <h2 className="main-section-title mb-6 mt-0 text-primary-purple">الفئات</h2>
        <div className="flex flex-row justify-between gap-4 mb-10 w-full">
          {categories.map((cat, idx) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 min-w-0 custom-rounded custom-shadow flex items-center justify-between p-4 cursor-pointer transition-all duration-300 h-20 border-3 relative overflow-hidden font-bold text-lg ${selectedCategory === cat ? 'bg-primary-purple text-white border-primary-purple' : 'bg-yellow-400 border-primary-purple text-primary-purple'}`}
              style={{
                backgroundImage:
                  selectedCategory === cat
                    ? undefined
                    : 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(139,69,19,0.05) 8px, rgba(139,69,19,0.05) 16px)',
                backgroundColor: selectedCategory === cat ? '#6B46C1' : '#facc15',
              }}
            >
              <span className="ml-2">{cat}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base ${selectedCategory === cat ? 'bg-white text-primary-purple' : 'bg-white text-primary-purple'}`}>
                {getCategoryCount(cat)}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
          {filteredSubjects.map((subject, idx) => (
            <SubjectCard
              key={subject.title + idx}
              image={subject.image}
              title={subject.title}
              backgroundColor={getSubjectBackgroundColor(subject.title)}
            />
          ))}
        </div>
      </div>

      {/* قسم معلومات الفرق */}
      <div className="container mx-auto mb-24 mt-16 team-setup-section">
        <h2 className="main-section-title mb-12 mt-0 flex items-center justify-center gap-2">
          <UserGroupIcon className="w-8 h-8" />
          معلومات الفرق
        </h2>
        <div className="flex flex-col items-center gap-8">
          <div className="container">
            <div className="relative flex items-center">
              <input
                type="text"
                value={className}
                onChange={e => setClassName(e.target.value)}
                placeholder="اسم اللعبة"
                className="custom-border custom-rounded px-8 py-7 text-3xl font-bold w-full outline-none focus:ring-2 focus:ring-primary-purple bg-white text-text-dark pr-16"
              />
              <button
                type="button"
                onClick={generateGameName}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-primary-purple rounded-full p-2 transition-colors"
                title="توليد اسم عشوائي"
              >
                <SparklesIcon className="w-8 h-8" />
              </button>
            </div>
          </div>
          <div className="container">
            <div className="mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-8 h-8 text-primary-purple" />
              <h3 className="text-2xl font-bold text-primary-purple">أسماء الفرق</h3>
            </div>
            <div className="relative group">
              <div className="custom-label">اسم الفريق</div>
              <input
                type="text"
                value={teamNameInput}
                onChange={e => setTeamNameInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTeam();
                  }
                }}
                placeholder="اكتب اسم الفريق هنا"
                className="custom-input"
              />
            </div>
            <button
              onClick={addTeam}
              disabled={teams.length >= 4 || !teamNameInput.trim()}
              className={`mt-4 flex items-center gap-2 custom-btn ${
                teams.length >= 4 || !teamNameInput.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : ''
              }`}
            >
              <PlusIcon className="w-6 h-6" />
              إضافة فريق
            </button>
          </div>
          <div className="w-full pt-8">
            <div className="flex justify-center items-end gap-8 flex-wrap">
              {teams.map((team, index) => (
                <div key={index} className="relative flex flex-col items-center gap-3 animate-bounce-in">
                  <div className="avatar-container flex items-center justify-center animate-scale-in group relative">
                    <img
                      src={team.avatar}
                      alt={`Avatar for ${team.name}`}
                      className="avatar-image"
                    />
                    <button
                      onClick={() => removeTeam(index)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100 z-20"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <img src="/assets/close.png" alt="حذف" className="w-8 h-8" />
                    </button>
                  </div>
                  <span className="text-primary-purple font-bold text-xl animate-fade-in">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="container flex justify-center mb-12 start-button-section">
        <button
          onClick={handleStart}
          disabled={!canStartGame}
          className={`custom-btn text-xl px-20 py-4 shadow-button text-white rounded-[2rem] ${
            canStartGame 
              ? 'bg-primary-purple border-button-yellow' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{
            borderWidth: canStartGame ? '3px' : '0px',
            borderColor: canStartGame ? '#facc15' : 'transparent'
          }}
        >
          ابدأ المسابقة
        </button>
      </div>
      {!canStartGame && (
        <div className="text-red-500 font-bold text-center mb-4">يجب إضافة فريقين على الأقل للبدء</div>
      )}
    </div>
  );
};

export default FamilyChallenge; 