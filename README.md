# טופס החזרי מס

טופס אינטראקטיבי לבדיקת זכאות להחזרי מס.

## שילוב הטופס באתר

כדי לשלב את הטופס באתר שלך, הוסף את הקוד הבא:

```html
<!-- הוספת הטופס -->
<iframe 
  src="https://YOUR_GITHUB_USERNAME.github.io/tax-refund-form" 
  style="width: 100%; border: none;" 
  id="taxFormIframe">
</iframe>

<!-- סקריפט להתאמת גובה אוטומטית -->
<script>
  window.addEventListener('message', function(event) {
    if (event.data.type === 'setHeight') {
      document.getElementById('taxFormIframe').style.height = event.data.height + 'px';
    }
  });
</script>
```

## תכונות

- טופס רב-שלבי עם התקדמות ויזואלית
- בדיקת זכאות אוטומטית
- שליחת פרטים למייל
- תמיכה מלאה בעברית
- עיצוב מותאם למובייל
- התאמת גובה אוטומטית
