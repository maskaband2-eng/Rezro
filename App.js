import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, I18nManager, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const G = '#0E8A33', DG = '#06361A', LIME = '#8CE62A', BG = '#F0F5F2';
const R = I18nManager.isRTL ? 'row' : 'row-reverse';
const CATS = [
  { k: 'سینما', e: '🍿' }, { k: 'استخر', e: '🥽' }, { k: 'فوتسال', e: '👟' }, { k: 'فوتبال', e: '⚽' },
  { k: 'سایر خدمات', e: '🟩' }, { k: 'باشگاه', e: '🏋️' }, { k: 'بولینگ', e: '🎳' }, { k: 'تنیس', e: '🎾' },
];
const VENUES = [
  { id: 1, n: 'استخر المپیک رشت', c: 'استخر', p: 180000, d: 20, a: 'رشت، بلوار گیلان', e: '🏊' },
  { id: 2, n: 'سالن فوتسال ستارگان', c: 'فوتسال', p: 450000, d: 15, a: 'رشت، گلسار', e: '👟' },
  { id: 3, n: 'سینما ایران', c: 'سینما', p: 120000, d: 10, a: 'رشت، میدان شهرداری', e: '🎬' },
  { id: 4, n: 'زمین چمن شمال', c: 'فوتبال', p: 600000, d: 0, a: 'رشت، سعدی', e: '⚽' },
  { id: 5, n: 'بولینگ پارس', c: 'بولینگ', p: 250000, d: 5, a: 'رشت، منظریه', e: '🎳' },
  { id: 6, n: 'کورت تنیس باران', c: 'تنیس', p: 300000, d: 0, a: 'رشت، لکسار', e: '🎾' },
  { id: 7, n: 'باشگاه آرمان', c: 'باشگاه', p: 200000, d: 12, a: 'رشت، معلم', e: '🏋️' },
];
const DAYS = ['امروز', 'فردا', 'پس‌فردا', '۳ روز دیگر', '۴ روز دیگر'];
const SLOTS = ['۱۶:۰۰', '۱۷:۰۰', '۱۸:۰۰', '۱۹:۰۰', '۲۰:۰۰', '۲۱:۰۰', '۲۲:۰۰', '۲۳:۰۰'];
const TAKEN = ['۱۸:۰۰', '۲۰:۰۰'];
const fa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default function App() {
  const [tab, setTab] = useState('home');
  const [cat, setCat] = useState(null);
  const [q, setQ] = useState('');
  const [v, setV] = useState(null);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(null);
  const [bk, setBk] = useState([]);
  const [fav, setFav] = useState([]);
  const [panel, setPanel] = useState(null);

  const open = (x) => { setV(x); setDay(0); setSlot(null); };
  const goCat = (k) => { setCat(k === 'سایر خدمات' ? null : k); setQ(''); setTab('venues'); };
  const list = VENUES.filter((x) => (!cat || x.c === cat) && x.n.includes(q));
  const reserve = () => {
    if (!slot) return Alert.alert('رزرو', 'ابتدا یک سانس انتخاب کنید');
    setBk([{ id: Date.now(), v, day: DAYS[day], slot }, ...bk]);
    Alert.alert('رزرو ثبت شد ✅', `${v.n}\n${DAYS[day]} ساعت ${slot}`);
    setV(null); setTab('bookings');
  };

  const Card = ({ x, w }) => (
    <TouchableOpacity style={[s.vc, w && { width: 230 }]} onPress={() => open(x)} activeOpacity={0.85}>
      <LinearGradient colors={['#0E8A33', '#06361A']} style={s.vimg}>
        <Text style={{ fontSize: 46 }}>{x.e}</Text>
        {x.d > 0 && <View style={s.badge}><Text style={s.badgeT}>تخفیف {fa(x.d)}٪</Text></View>}
        <TouchableOpacity style={s.heart} onPress={() => setFav(fav.includes(x.id) ? fav.filter((i) => i !== x.id) : [...fav, x.id])}>
          <Text style={{ fontSize: 18 }}>{fav.includes(x.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </LinearGradient>
      <Text style={s.vn}>{x.n}</Text>
      <Text style={s.vs}>{x.a}</Text>
      <Text style={s.vp}>از {fa(x.p)} تومان</Text>
    </TouchableOpacity>
  );

  const Grid = () => (
    <View style={s.grid}>
      {CATS.map((c) => (
        <TouchableOpacity key={c.k} style={s.cat} onPress={() => goCat(c.k)}>
          <Text style={{ fontSize: 34 }}>{c.e}</Text>
          <Text style={s.catT}>{c.k}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const Back = ({ f }) => (
    <TouchableOpacity onPress={f} style={s.back}><Text style={{ color: G, fontWeight: '700' }}>بازگشت ›</Text></TouchableOpacity>
  );

  let body;
  if (panel) {
    const owner = panel === 'owner';
    body = (
      <ScrollView contentContainerStyle={s.pad}>
        <Back f={() => setPanel(null)} />
        <Text style={s.h}>{owner ? 'پنل مجموعه‌دار' : 'پنل مدیریت رزرو'}</Text>
        <View style={s.stats}>
          {(owner ? [['رزروها', fa(bk.length + 24)], ['درآمد', fa(7200000)], ['سانس‌ها', fa(8)]] : [['مجموعه‌ها', fa(VENUES.length)], ['کارمزد ۱۰٪', fa(1450000)], ['کاربران', fa(312)]]).map(([a, b]) => (
            <View key={a} style={s.stat}><Text style={s.statN}>{b}</Text><Text style={s.vs}>{a}</Text></View>
          ))}
        </View>
        {(owner ? SLOTS : VENUES.map((x) => x.n)).map((t) => (
          <View key={t} style={s.row}><Text style={s.rowT}>{t}</Text><Text style={{ color: G }}>{owner ? (TAKEN.includes(t) ? 'رزرو شده' : 'خالی') : 'فعال'}</Text></View>
        ))}
        <Text style={s.note}>اتصال به دیتابیس و پرداخت آنلاین در نسخه‌های بعدی اضافه می‌شود.</Text>
      </ScrollView>
    );
  } else if (v) {
    body = (
      <ScrollView contentContainerStyle={s.pad}>
        <Back f={() => setV(null)} />
        <LinearGradient colors={['#0E8A33', '#06361A']} style={[s.vimg, { height: 170 }]}><Text style={{ fontSize: 80 }}>{v.e}</Text></LinearGradient>
        <Text style={s.h}>{v.n}</Text>
        <Text style={s.vs}>📍 {v.a}  •  {v.c}</Text>
        <Text style={s.vp}>قیمت هر سانس: {fa(v.p)} تومان</Text>
        <Text style={s.sec}>انتخاب تاریخ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DAYS.map((d, i) => (
            <TouchableOpacity key={d} onPress={() => setDay(i)} style={[s.chip, day === i && s.chipOn]}><Text style={[s.chipT, day === i && { color: '#fff' }]}>{d}</Text></TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={s.sec}>انتخاب سانس</Text>
        <View style={s.slots}>
          {SLOTS.map((t) => {
            const off = TAKEN.includes(t);
            return (
              <TouchableOpacity key={t} disabled={off} onPress={() => setSlot(t)} style={[s.slot, slot === t && s.chipOn, off && { opacity: 0.35 }]}>
                <Text style={[s.chipT, slot === t && { color: '#fff' }]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={s.cta} onPress={reserve}><Text style={s.ctaT}>ثبت رزرو</Text></TouchableOpacity>
      </ScrollView>
    );
  } else if (tab === 'home') {
    body = (
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <LinearGradient colors={[DG, G]} style={s.top}>
          <View style={s.topRow}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
            <Text style={s.logo}>رزرو</Text>
            <Text style={{ fontSize: 22 }}>🔍</Text>
          </View>
          <Text style={s.city}>📍 رشت</Text>
          <View style={s.banner}>
            <Text style={s.bt}>همه چیز برای <Text style={{ color: LIME }}>رزرو</Text> لحظه‌ای</Text>
            <Text style={s.bs}>ورزش، تفریح، سرگرمی و بیشتر...</Text>
            <TouchableOpacity style={s.bb} onPress={() => setTab('venues')}><Text style={{ fontWeight: '800', color: DG }}>شروع رزرو ‹</Text></TouchableOpacity>
            <Text style={s.bemoji}>🏆⚽🏀</Text>
          </View>
        </LinearGradient>
        <View style={s.pad}>
          <Grid />
          <View style={s.quick}>
            {[['🏷️', 'تخفیف‌ها', () => setTab('venues')], ['📅', 'رزروهای من', () => setTab('bookings')], ['💚', 'علاقه‌مندی‌ها', () => { setQ(''); setCat(null); setTab('venues'); }], ['🎧', 'پشتیبانی', () => Alert.alert('پشتیبانی', 'به‌زودی')]].map(([e, t, f]) => (
              <TouchableOpacity key={t} style={s.qi} onPress={f}><Text style={{ fontSize: 24 }}>{e}</Text><Text style={s.qt}>{t}</Text></TouchableOpacity>
            ))}
          </View>
          <View style={s.between}>
            <TouchableOpacity onPress={() => setTab('venues')}><Text style={{ color: G, fontWeight: '700' }}>‹ مشاهده همه</Text></TouchableOpacity>
            <Text style={s.h}>مجموعه‌های پیشنهادی 🔥</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {VENUES.map((x) => <Card key={x.id} x={x} w />)}
        </ScrollView>
      </ScrollView>
    );
  } else if (tab === 'venues' || tab === 'cats') {
    body = (
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.h}>{tab === 'cats' ? 'دسته‌بندی‌ها' : cat ? `مجموعه‌های ${cat}` : 'همه مجموعه‌ها'}</Text>
        {tab === 'cats' ? <Grid /> : (
          <>
            <TextInput style={s.input} placeholder="جستجوی مجموعه..." value={q} onChangeText={setQ} textAlign="right" />
            {list.map((x) => <Card key={x.id} x={x} />)}
            {!list.length && <Text style={s.note}>مجموعه‌ای پیدا نشد.</Text>}
          </>
        )}
      </ScrollView>
    );
  } else if (tab === 'bookings') {
    body = (
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.h}>رزروهای من</Text>
        {!bk.length && <Text style={s.note}>هنوز رزروی ندارید. یک مجموعه انتخاب کنید.</Text>}
        {bk.map((b) => (
          <View key={b.id} style={s.bkc}>
            <Text style={s.vn}>{b.v.n}</Text>
            <Text style={s.vs}>{b.day} • ساعت {b.slot}</Text>
            <Text style={s.vp}>{fa(b.v.p)} تومان • در انتظار پرداخت</Text>
          </View>
        ))}
      </ScrollView>
    );
  } else {
    body = (
      <ScrollView contentContainerStyle={s.pad}>
        <View style={{ alignItems: 'center', marginVertical: 18 }}>
          <View style={s.avatar}><Text style={{ fontSize: 40 }}>👤</Text></View>
          <Text style={s.h}>کاربر رزرو</Text>
          <Text style={s.vs}>نسخه ۱٫۱</Text>
        </View>
        {[['🏢 پنل مجموعه‌دار', () => setPanel('owner')], ['🛠️ پنل مدیریت', () => setPanel('admin')], ['📅 رزروهای من', () => setTab('bookings')]].map(([t, f]) => (
          <TouchableOpacity key={t} style={s.row} onPress={f}><Text style={s.rowT}>{t}</Text><Text>‹</Text></TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const tabs = [['profile', '👤', 'پروفایل'], ['bookings', '📋', 'رزروهای من'], ['home', '🏠', 'خانه'], ['venues', '🏪', 'مجموعه‌ها'], ['cats', '▦', 'دسته‌بندی‌ها']];
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={DG} />
      <View style={{ height: StatusBar.currentHeight || 30, backgroundColor: DG }} />
      <View style={{ flex: 1 }}>{body}</View>
      <View style={s.nav}>
        {tabs.map(([k, e, t]) => (
          <TouchableOpacity key={k} style={s.ni} onPress={() => { setTab(k); setV(null); setPanel(null); if (k !== 'venues') setCat(null); }}>
            <View style={k === 'home' ? s.homeBtn : null}><Text style={{ fontSize: k === 'home' ? 26 : 20 }}>{e}</Text></View>
            <Text style={[s.nt, tab === k && { color: G, fontWeight: '800' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const sh = { elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 };
const s = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 110 },
  top: { padding: 16, paddingBottom: 22, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#fff', fontSize: 34, fontWeight: '900' },
  city: { color: '#d8f5e0', textAlign: 'right', marginVertical: 8 },
  banner: { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 24, padding: 18, minHeight: 150 },
  bt: { color: '#fff', fontSize: 21, fontWeight: '900', textAlign: 'right' },
  bs: { color: '#cfe', textAlign: 'right', marginTop: 6 },
  bb: { backgroundColor: LIME, alignSelf: 'flex-end', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, marginTop: 14 },
  bemoji: { position: 'absolute', left: 14, bottom: 12, fontSize: 38 },
  grid: { flexDirection: R, flexWrap: 'wrap', justifyContent: 'space-between' },
  cat: { width: '23%', backgroundColor: '#fff', borderRadius: 20, paddingVertical: 14, alignItems: 'center', marginBottom: 10, ...sh },
  catT: { fontWeight: '800', marginTop: 6, fontSize: 12, color: '#123' },
  quick: { flexDirection: R, justifyContent: 'space-between', marginVertical: 8 },
  qi: { width: '23%', backgroundColor: '#fff', borderRadius: 18, paddingVertical: 12, alignItems: 'center', ...sh },
  qt: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  between: { flexDirection: R, justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 6 },
  h: { fontSize: 20, fontWeight: '900', color: '#0b2a16', textAlign: 'right', marginVertical: 8 },
  sec: { fontSize: 16, fontWeight: '800', textAlign: 'right', marginTop: 18, marginBottom: 8 },
  vc: { backgroundColor: '#fff', borderRadius: 22, padding: 10, marginBottom: 14, marginEnd: 10, ...sh },
  vimg: { height: 120, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 8, right: 8, backgroundColor: G, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3 },
  badgeT: { color: '#fff', fontSize: 11, fontWeight: '800' },
  heart: { position: 'absolute', top: 6, left: 8 },
  vn: { fontWeight: '900', fontSize: 15, textAlign: 'right', marginTop: 8 },
  vs: { color: '#667', textAlign: 'right', marginTop: 2 },
  vp: { color: G, fontWeight: '800', textAlign: 'right', marginTop: 4 },
  input: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginVertical: 8, ...sh },
  chip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginEnd: 8, ...sh },
  chipOn: { backgroundColor: G },
  chipT: { fontWeight: '700', color: '#123' },
  slots: { flexDirection: R, flexWrap: 'wrap', gap: 8 },
  slot: { backgroundColor: '#fff', width: '23%', paddingVertical: 12, borderRadius: 14, alignItems: 'center', ...sh },
  cta: { backgroundColor: G, borderRadius: 20, padding: 16, alignItems: 'center', marginTop: 24 },
  ctaT: { color: '#fff', fontWeight: '900', fontSize: 17 },
  back: { alignSelf: 'flex-end', paddingVertical: 6 },
  note: { color: '#778', textAlign: 'center', marginTop: 20 },
  bkc: { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 10, ...sh },
  row: { flexDirection: R, justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 8, ...sh },
  rowT: { fontWeight: '700' },
  stats: { flexDirection: R, justifyContent: 'space-between', marginBottom: 12 },
  stat: { width: '31%', backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center', ...sh },
  statN: { fontWeight: '900', fontSize: 16, color: G },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#d6f2de', alignItems: 'center', justifyContent: 'center' },
  nav: { position: 'absolute', bottom: 10, left: 10, right: 10, flexDirection: R, backgroundColor: '#fff', borderRadius: 30, paddingVertical: 8, ...sh, elevation: 10 },
  ni: { flex: 1, alignItems: 'center' },
  nt: { fontSize: 10, color: '#556', marginTop: 2 },
  homeBtn: { backgroundColor: G, width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginTop: -26 },
});
