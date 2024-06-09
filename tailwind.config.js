/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          50:'#f6f3ff',
          100:'#eae8fa',
          200:'#dbd9eb',
          300:'#c6c4d6',
          400:'#a09eaf',
          500:'#7e7c8c',
          600:'#585665', 
          700:'#464452',
          800:'#282734',
          'base-900':'#050115'
        },
        background: {
          'base-50':'#fffdf6',
          100:'#faf8f1',
          200:'#f5f3ec',
          300:'#f0eee7',
          400:'#d2d0ca',
          500:'#b5b4ad',
          600:'#8b8983',
          700:'#75746e',
          800:'#55544e',
          900:'#32312c'
        },
        primary: {
          50:'#f0e6ff',
          100:'#d5c1fe',
          200:'#b997fe',
          300:'#996aff',
          400:'#7e44ff',
          500:'#5d11fd',
          'base-600':'#4e0bf7',
          700:'#3300ef',
          800:'#0000eb',
          900:'#0000e7'
        },
        secondary: {
          50:'#ffedf1',
          100:'#ffd2d9',
          200:'#ffa1a4',
          'base-300':'#fb7c80',
          400:'#ff5b5e',
          500:'#ff4a44',
          600:'#ff4244',
          700:'#ef383e',
          800:'#e23136',
          900:'#d2252a'
        },
        accent: {
          50:'#fff9e6',
          100:'#ffeebf',
          200:'#ffe497',
          300:'#ffdb71',
          400:'#ffd15b',
          500:'#ffca54',
          600:'#ffbd4e',
          700:'#fcab49',
          'base-800':'#f99d46',
          900:'#f48341'
        },
        alert: {
          50:'#ffe8e7',
          100:'#ffa690',
          200:'#ffa690',
          300:'#ff8163',
          400:'#ff6140',
          500:'#ff3c1e',
          600:'#ff351a',
          700:'#fc2d13',
          800:'#ee220e',
          'base-900':'#d60000',
        },

      }
    },

  },
  plugins: [],
}

