import React from 'react';

interface SubjectCardProps {
  image: string;
  title: string;
  isSelected?: boolean;
  isDimmed?: boolean;
  onClick?: () => void;
  backgroundColor?: string;
  borderColor?: string;
  titleColor?: string;
  titleBgColor?: string;
  borderTopColor?: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  image,
  title,
  isSelected = false,
  isDimmed = false,
  onClick,
  backgroundColor = '#facc15',
  borderColor = isSelected ? '#6B46C1' : isDimmed ? '#6B7280' : '#6B46C1',
  titleColor = isSelected ? '#fff' : isDimmed ? '#374151' : '#6B46C1',
  titleBgColor = isSelected ? '#6B46C1' : isDimmed ? '#D1D5DB' : '#facc15',
  borderTopColor = isDimmed ? '#6B7280' : '#6B46C1',
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-diagonal-bg custom-rounded custom-shadow flex flex-col overflow-hidden aspect-square cursor-pointer transition-all duration-300 ${isSelected ? 'bg-primary-purple border-3 border-primary-purple' : isDimmed ? 'bg-gray-300 border-3 border-gray-500' : 'custom-border'}`}
      style={!isSelected && !isDimmed ? { backgroundColor } : {}}
      dir="rtl"
    >
      <div
        className="flex-1 relative"
        style={!isDimmed ? { backgroundColor } : {}}
      >
        <img
          src={image}
          alt={title}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''} hover:scale-110`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = 'absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-purple/20 to-primary-purple/40';
            fallbackDiv.innerHTML = '<div class="text-4xl font-bold text-primary-purple">📚</div>';
            e.currentTarget.parentNode?.appendChild(fallbackDiv);
          }}
          onLoad={(e) => {
            // استخراج اللون السائد من الصورة وتطبيقه كخلفية
            const img = e.currentTarget;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              ctx.drawImage(img, 0, 0);
              
              try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                let r = 0, g = 0, b = 0, count = 0;
                
                // حساب متوسط الألوان من الصورة
                for (let i = 0; i < data.length; i += 4) {
                  r += data[i];
                  g += data[i + 1];
                  b += data[i + 2];
                  count++;
                }
                
                if (count > 0) {
                  r = Math.round(r / count);
                  g = Math.round(g / count);
                  b = Math.round(b / count);
                  
                  // تطبيق اللون كخلفية للمربع
                  const parentDiv = img.closest('.card-diagonal-bg');
                  if (parentDiv && !isSelected && !isDimmed) {
                    (parentDiv as HTMLElement).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                    const imageContainer = img.parentElement;
                    if (imageContainer) {
                      imageContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                    }
                  }
                }
              } catch (error) {
                // في حالة حدوث خطأ، استخدم اللون الافتراضي
                console.log('Error extracting color from image:', error);
              }
            }
          }}
        />
      </div>
      <div
        className={`font-extrabold text-lg py-4 px-4 text-center transition-colors duration-300 relative z-10 ${isSelected ? 'bg-primary-purple text-white' : isDimmed ? 'bg-gray-300 text-gray-700' : 'text-primary-purple'}`}
        style={{ borderTop: `3px solid ${borderTopColor}`, backgroundColor: titleBgColor, color: titleColor }}
      >
        {title}
      </div>
    </div>
  );
};

export default SubjectCard; 